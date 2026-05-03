def runCommand(String command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

def commandOutput(String command) {
  if (isUnix()) {
    return sh(script: command, returnStdout: true).trim()
  }

  return bat(script: "@${command}", returnStdout: true).trim()
}

def envRef(String name) {
  return isUnix() ? "\$${name}" : "%${name}%"
}

def powershellRef() {
  return isUnix() ? "pwsh" : "powershell"
}

def deployCommand() {
  if (isUnix()) {
    return "bash scripts/deploy-blog-local.sh --image ${envRef('BLOG_IMAGE')} --pull"
  }

  return "${powershellRef()} -NoProfile -ExecutionPolicy Bypass -File scripts/deploy-blog-local.ps1 -Image ${envRef('BLOG_IMAGE')} -Pull"
}

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    string(name: 'REGISTRY', defaultValue: 'localhost:5000', description: 'Docker 이미지 registry 주소')
    booleanParam(name: 'START_LOCAL_REGISTRY', defaultValue: true, description: '파이프라인에서 로컬 registry 컨테이너를 실행')
    booleanParam(name: 'DEPLOY_LOCAL', defaultValue: false, description: '이미지 push 후 로컬 blue-green 스택에 배포')
  }

  environment {
    CI = 'true'
    NEXT_TELEMETRY_DISABLED = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Prepare') {
      steps {
        script {
          env.GIT_SHORT_SHA = commandOutput('git rev-parse --short=12 HEAD')
          env.BLOG_IMAGE = "${params.REGISTRY}/atelier-blog:${env.GIT_SHORT_SHA}"
        }

        runCommand('node --version')
        runCommand('corepack enable')
        runCommand('corepack prepare pnpm@9.0.0 --activate')
        runCommand('pnpm --version')
      }
    }

    stage('Install') {
      steps {
        runCommand('pnpm install --frozen-lockfile')
      }
    }

    stage('Workspace Checks') {
      steps {
        runCommand('pnpm lint')
        runCommand('pnpm typecheck')
        runCommand('pnpm test')
        runCommand('pnpm build')
      }
    }

    stage('Start Local Registry') {
      when {
        expression { return params.START_LOCAL_REGISTRY }
      }

      steps {
        runCommand('docker compose up -d registry')
      }
    }

    stage('Build Blog Image') {
      steps {
        script {
          runCommand("docker build --no-cache -f apps/blog/Dockerfile -t ${envRef('BLOG_IMAGE')} .")
        }
      }
    }

    stage('Push Blog Image') {
      steps {
        script {
          runCommand("docker push ${envRef('BLOG_IMAGE')}")
        }
      }
    }

    stage('Deploy Local') {
      when {
        expression { return params.DEPLOY_LOCAL }
      }

      steps {
        script {
          runCommand(deployCommand())
        }
      }
    }
  }

  post {
    always {
      echo "Blog image: ${env.BLOG_IMAGE}"
    }
  }
}
