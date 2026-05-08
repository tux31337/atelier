/**
 * GLB 에셋 bounding box 측정 스크립트
 * 실행: node apps/blog/scripts/measure-assets.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = join(__dirname, "../public/models/GLB format");

// three.js와 GLTFLoader를 동적으로 가져오기 위해 간단한 GLB 파서 작성
// GLB 파일에서 accessor data를 읽어 POSITION attribute의 min/max 추출

function readGlbBounds(filePath) {
  const buf = readFileSync(filePath);

  // GLB 헤더 검증
  const magic = buf.readUInt32LE(0);
  if (magic !== 0x46546c67) return null; // "glTF"

  const jsonLength = buf.readUInt32LE(12);
  const jsonStr = buf.slice(20, 20 + jsonLength).toString("utf8");
  const gltf = JSON.parse(jsonStr);

  // binary chunk
  const binOffset = 20 + jsonLength + 8; // skip bin chunk header (8 bytes)

  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (const accessor of gltf.accessors ?? []) {
    if (accessor.min && accessor.max && accessor.type === "VEC3") {
      minX = Math.min(minX, accessor.min[0]);
      minY = Math.min(minY, accessor.min[1]);
      minZ = Math.min(minZ, accessor.min[2]);
      maxX = Math.max(maxX, accessor.max[0]);
      maxY = Math.max(maxY, accessor.max[1]);
      maxZ = Math.max(maxZ, accessor.max[2]);
    }
  }

  if (!isFinite(minX)) return null;
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    size: [maxX - minX, maxY - minY, maxZ - minZ],
  };
}

const targets = [
  "wall", "wall-corner", "wall-door", "wall-window-glass",
  "wall-window-stone", "wall-window-round",
  "wall-wood", "wall-wood-corner", "wall-wood-door",
  "wall-wood-window-glass", "wall-wood-window-shutters",
  "roof-flat", "roof-gable", "roof-gable-end",
  "roof-high-flat", "roof-high-gable", "roof-high-gable-end",
  "roof", "roof-left", "roof-right", "roof-corner",
  "chimney", "chimney-base", "chimney-top",
  "road",
];

console.log("에셋 치수 측정 결과 (native scale, 단위: glTF 미터)");
console.log("=".repeat(70));
console.log(
  "이름".padEnd(32) +
  "width(X)".padStart(10) +
  "height(Y)".padStart(10) +
  "depth(Z)".padStart(10)
);
console.log("-".repeat(70));

for (const name of targets) {
  const path = join(MODELS_DIR, `${name}.glb`);
  try {
    const bounds = readGlbBounds(path);
    if (!bounds) {
      console.log(name.padEnd(32) + "  (측정 불가)");
      continue;
    }
    const [w, h, d] = bounds.size.map((v) => v.toFixed(3));
    console.log(
      name.padEnd(32) +
      w.padStart(10) +
      h.padStart(10) +
      d.padStart(10)
    );
  } catch {
    console.log(name.padEnd(32) + "  (파일 없음)");
  }
}
