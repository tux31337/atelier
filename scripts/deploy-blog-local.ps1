param(
  [string] $Image = "atelier-blog:test",
  [switch] $Build
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$activeFile = Join-Path $root "infra/nginx/includes/blog-active.conf"
$blueFile = Join-Path $root "infra/nginx/includes/blog-blue.conf"
$greenFile = Join-Path $root "infra/nginx/includes/blog-green.conf"

function Invoke-RootCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string[]] $Arguments
  )

  Push-Location $root
  try {
    & $Arguments[0] $Arguments[1..($Arguments.Length - 1)]
    if ($LASTEXITCODE -ne 0) {
      throw "Command failed: $($Arguments -join ' ')"
    }
  }
  finally {
    Pop-Location
  }
}

function Get-RunningState {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Container
  )

  $state = & docker inspect -f "{{.State.Running}}" $Container 2>$null
  if ($LASTEXITCODE -ne 0) {
    return $false
  }

  return $state -eq "true"
}

function Wait-Health {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Url,

    [int] $TimeoutSeconds = 90
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-RestMethod -Uri $Url -TimeoutSec 3
      if ($response.ok -eq $true -and $response.app -eq "blog") {
        return
      }
    }
    catch {
      Start-Sleep -Seconds 2
      continue
    }

    Start-Sleep -Seconds 2
  }

  throw "Health check failed: $Url"
}

$activeContent = Get-Content -Raw -Encoding utf8 $activeFile
$currentSlot = if ($activeContent -match "blog-green") { "green" } else { "blue" }
$targetSlot = if ($currentSlot -eq "blue") { "green" } else { "blue" }

$targetService = "blog-$targetSlot"
$targetContainer = "atelier-blog-$targetSlot"
$previousContainer = "atelier-blog-$currentSlot"
$targetPort = if ($targetSlot -eq "blue") { 3001 } else { 3002 }
$targetHealthUrl = "http://127.0.0.1:$targetPort/api/health"
$targetInclude = if ($targetSlot -eq "blue") { $blueFile } else { $greenFile }

Write-Host "Current slot: $currentSlot"
Write-Host "Target slot: $targetSlot"
Write-Host "Image: $Image"

Write-Host "Starting target container: $targetContainer"
$previousBlogImage = $env:BLOG_IMAGE
$env:BLOG_IMAGE = $Image
$composeArgs = @("docker", "compose", "up", "-d", $targetService)
if ($Build -or $Image -eq "atelier-blog:test") {
  $composeArgs = @("docker", "compose", "up", "--build", "-d", $targetService)
}

try {
  Invoke-RootCommand -Arguments $composeArgs
}
finally {
  if ($null -eq $previousBlogImage) {
    Remove-Item Env:BLOG_IMAGE -ErrorAction SilentlyContinue
  }
  else {
    $env:BLOG_IMAGE = $previousBlogImage
  }
}

Write-Host "Waiting for health check: $targetHealthUrl"
Wait-Health -Url $targetHealthUrl

$previousActiveContent = Get-Content -Raw -Encoding utf8 $activeFile

try {
  Write-Host "Switching active upstream to $targetSlot"
  Copy-Item -LiteralPath $targetInclude -Destination $activeFile -Force

  if (-not (Get-RunningState -Container "atelier-nginx")) {
    Write-Host "Starting nginx"
    Invoke-RootCommand -Arguments @("docker", "compose", "up", "-d", "nginx")
  }

  Write-Host "Validating nginx configuration"
  Invoke-RootCommand -Arguments @("docker", "exec", "atelier-nginx", "nginx", "-t")

  Write-Host "Reloading nginx"
  Invoke-RootCommand -Arguments @("docker", "exec", "atelier-nginx", "nginx", "-s", "reload")
}
catch {
  Write-Host "Switch failed. Restoring previous active upstream."
  Set-Content -LiteralPath $activeFile -Value $previousActiveContent -Encoding utf8
  throw
}

if (Get-RunningState -Container $previousContainer) {
  Write-Host "Stopping previous container: $previousContainer"
  & docker stop $previousContainer | Out-Null
}

Write-Host "Blog deployment switched to $targetSlot."
