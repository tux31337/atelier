"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ROOM_ROUTES } from "./room-routes";

const CHARACTER_MODEL = "/models/Wolf.glb";
const VM_BASE = "/models/GLB%20format";
const vm = (name: string) => `${VM_BASE}/${name}.glb`;

const PLAYER_SPEED = 6;
const CAMERA_DISTANCE = 5;
const CAMERA_BASE_HEIGHT = 1.8;
const LOOK_AT_HEIGHT = 1.0;
const PITCH_MIN = -0.3;
const PITCH_MAX = 1.25;
const PLAZA_HALF = 40;
const CAMERA_MAX_Y = 14;
const PLAYER_INSET = 0.4;
const CAMERA_INSET = 0.2;
const ROUTE_PATCH_RADIUS = 3;

const PLAYER_BOUNDS = {
  minX: -PLAZA_HALF + PLAYER_INSET,
  maxX: PLAZA_HALF - PLAYER_INSET,
  minZ: -PLAZA_HALF + PLAYER_INSET,
  maxZ: PLAZA_HALF - PLAYER_INSET,
};
const CAMERA_BOUNDS = {
  minX: -PLAZA_HALF + CAMERA_INSET,
  maxX: PLAZA_HALF - CAMERA_INSET,
  minZ: -PLAZA_HALF + CAMERA_INSET,
  maxZ: PLAZA_HALF - CAMERA_INSET,
};

export function AtelierRoom() {
  return (
    <section
      className="relative min-h-0 flex-1 overflow-hidden bg-[#090806]"
      aria-labelledby="atelier-room-title"
    >
      <div className="absolute inset-0">
        <Suspense fallback={<RoomLoading />}>
          <Canvas
            camera={{ position: [0, 6, 10], fov: 70 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
          >
            <fog attach="fog" args={["#1a1d2a", 30, 85]} />
            <color attach="background" args={["#1a1d2a"]} />
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none absolute left-6 top-5 z-10 max-w-sm rounded-md border border-stone-600/60 bg-[#11100f]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <p className="font-code-label text-code-label text-amber-200">Atelier Village</p>
        <h1 id="atelier-room-title" className="mt-2 font-headline-lg text-2xl text-stone-50">
          오픈월드 마을
        </h1>
        <p className="mt-2 font-body-md text-sm text-stone-300">
          WASD 이동 / 마우스 드래그로 시점 회전 · 사방 라우트 기둥으로 이동
        </p>
      </div>
    </section>
  );
}

function RoomLoading() {
  return (
    <div className="grid h-full place-items-center bg-[#090806] font-code-label text-code-label text-amber-200">
      마을을 불러오는 중
    </div>
  );
}

function Scene() {
  return (
    <group>
      <hemisphereLight args={["#b8c8d6", "#3a2a1f", 1.4]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 8]} intensity={2.2} />
      <directionalLight position={[-12, 14, -6]} intensity={1.0} color="#ffd9a3" />
      <Ground />
      <RoutePatches />
      {ROOM_ROUTES.map((route) => (
        <RouteMarker key={route.id} position={route.position} accent={route.accent} />
      ))}
      <Suspense fallback={null}>
        <VillageLayout />
      </Suspense>
      <Player />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[PLAZA_HALF * 2, PLAZA_HALF * 2]} />
      <meshStandardMaterial color="#3d3a28" roughness={0.98} />
    </mesh>
  );
}

function RoutePatches() {
  return (
    <group>
      {ROOM_ROUTES.map((route) => (
        <mesh
          key={route.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[route.position[0], 0.02, route.position[2]]}
        >
          <circleGeometry args={[ROUTE_PATCH_RADIUS, 48]} />
          <meshStandardMaterial
            color={route.accent}
            emissive={route.accent}
            emissiveIntensity={0.18}
            roughness={0.6}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function RouteMarker({
  position,
  accent,
}: {
  position: [number, number, number];
  accent: string;
}) {
  const [x, y, z] = position;
  const height = y * 2;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.9, height, 0.9]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          roughness={0.4}
        />
      </mesh>
      <pointLight position={[0, height + 0.5, 0]} intensity={2.2} distance={8} color={accent} />
    </group>
  );
}

// ─── Village Layout ──────────────────────────────────────────────────────────

interface GlbProps {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

function GlbModel({ path, position, rotation = [0, 0, 0], scale = 2 }: GlbProps) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} position={position} rotation={rotation} scale={scale} />;
}

function VillageLayout() {
  return (
    <group>
      <FountainPlaza />
      <RoadNetwork />
      <MarketDistrict />
      <VillageBuildings />
      <WindmillCorner />
      <WatermillCorner />
      <ScatteredTrees />
      <HedgeGardens />
      <ScatteredRocks />
    </group>
  );
}

function FountainPlaza() {
  return (
    <group>
      <GlbModel path={vm("fountain-round")} position={[0, 0, 0]} scale={2.5} />
      <GlbModel path={vm("fountain-center")} position={[0, 0, 0]} scale={2.5} />
      {/* 광장 모서리 가로등 */}
      <GlbModel path={vm("lantern")} position={[5, 0, 5]} />
      <GlbModel path={vm("lantern")} position={[-5, 0, 5]} />
      <GlbModel path={vm("lantern")} position={[5, 0, -5]} />
      <GlbModel path={vm("lantern")} position={[-5, 0, -5]} />
      {/* 도로변 가로등 */}
      <GlbModel path={vm("lantern")} position={[0, 0, -13]} />
      <GlbModel path={vm("lantern")} position={[0, 0, 13]} />
      <GlbModel path={vm("lantern")} position={[13, 0, 0]} />
      <GlbModel path={vm("lantern")} position={[-13, 0, 0]} />
    </group>
  );
}

function RoadNetwork() {
  // 도로 타일: scale=2 기준, 4유닛 간격으로 배치
  const ns: [number, number, number][] = [
    [0, 0, -4], [0, 0, -8], [0, 0, -12], [0, 0, -16], [0, 0, -20], [0, 0, -24], [0, 0, -28],
    [0, 0, 4],  [0, 0, 8],  [0, 0, 12],  [0, 0, 16],  [0, 0, 20],  [0, 0, 24],  [0, 0, 28],
  ];
  const ew: [number, number, number][] = [
    [-4, 0, 0], [-8, 0, 0], [-12, 0, 0], [-16, 0, 0], [-20, 0, 0], [-24, 0, 0], [-28, 0, 0],
    [4, 0, 0],  [8, 0, 0],  [12, 0, 0],  [16, 0, 0],  [20, 0, 0],  [24, 0, 0],  [28, 0, 0],
  ];
  return (
    <group>
      {ns.map((pos, i) => (
        <GlbModel key={`road-ns-${i}`} path={vm("road")} position={pos} />
      ))}
      {ew.map((pos, i) => (
        <GlbModel
          key={`road-ew-${i}`}
          path={vm("road")}
          position={pos}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}
    </group>
  );
}

function MarketDistrict() {
  return (
    <group>
      {/* 시장 노점 줄 */}
      <GlbModel path={vm("stall-green")} position={[18, 0, -5]} />
      <GlbModel path={vm("stall-red")} position={[18, 0, 0]} />
      <GlbModel path={vm("stall-green")} position={[18, 0, 5]} />
      <GlbModel path={vm("stall")} position={[21, 0, -5]} />
      <GlbModel path={vm("stall")} position={[21, 0, 5]} />
      {/* 시장 수레 */}
      <GlbModel
        path={vm("cart")}
        position={[15, 0, -2.5]}
        rotation={[0, Math.PI * 0.3, 0]}
      />
      <GlbModel
        path={vm("cart-high")}
        position={[15, 0, 2.5]}
        rotation={[0, -Math.PI * 0.2, 0]}
      />
      {/* 의자와 스툴 */}
      <GlbModel path={vm("stall-bench")} position={[20, 0, 0]} />
      <GlbModel path={vm("stall-stool")} position={[19, 0, -2.2]} />
      <GlbModel path={vm("stall-stool")} position={[19, 0, 2.2]} />
      {/* 시장 깃발 */}
      <GlbModel path={vm("banner-red")} position={[17, 0, -7]} />
      <GlbModel path={vm("banner-green")} position={[17, 0, 7]} />
    </group>
  );
}

function WindmillCorner() {
  return (
    <group position={[-28, 0, -28]}>
      <GlbModel path={vm("windmill")} position={[0, 0, 0]} scale={2.5} />
      <GlbModel path={vm("tree-high")} position={[5, 0, -4]} />
      <GlbModel path={vm("tree")} position={[-4, 0, 5]} rotation={[0, 1.2, 0]} />
      <GlbModel path={vm("rock-small")} position={[3, 0, 6]} scale={1.5} />
      <GlbModel path={vm("rock-wide")} position={[-5, 0, -5]} scale={1.5} />
    </group>
  );
}

function WatermillCorner() {
  return (
    <group position={[25, 0, 26]}>
      <GlbModel path={vm("watermill")} position={[0, 0, 0]} scale={2.5} />
      <GlbModel path={vm("tree-high-round")} position={[-5, 0, 3]} />
      <GlbModel path={vm("tree-crooked")} position={[5, 0, -4]} rotation={[0, 0.7, 0]} />
      <GlbModel path={vm("rock-large")} position={[4, 0, 5]} scale={1.8} />
    </group>
  );
}

function ScatteredTrees() {
  const trees: Array<{ path: string; pos: [number, number, number]; scale?: number; ry?: number }> = [
    // 북쪽
    { path: vm("tree-high"),        pos: [-8,  0, -22], scale: 2,   ry: 0.5 },
    { path: vm("tree-high-round"),  pos: [8,   0, -24], scale: 2,   ry: 1.1 },
    { path: vm("tree"),             pos: [-4,  0, -18], scale: 1.8, ry: 2.3 },
    { path: vm("tree-crooked"),     pos: [2,   0, -27], scale: 1.8, ry: 0.8 },
    { path: vm("tree-high-crooked"),pos: [3,   0, -34], scale: 2,   ry: 1.7 },
    // 남쪽
    { path: vm("tree-high"),        pos: [-8,  0, 22],  scale: 2,   ry: 0.3 },
    { path: vm("tree"),             pos: [8,   0, 24],  scale: 1.8, ry: 2.8 },
    { path: vm("tree-high-round"),  pos: [4,   0, 18],  scale: 2,   ry: 1.4 },
    { path: vm("tree-crooked"),     pos: [-6,  0, 32],  scale: 1.8, ry: 0.9 },
    // 서쪽
    { path: vm("tree-high-crooked"),pos: [-28, 0, -4],  scale: 2,   ry: 2.1 },
    { path: vm("tree-high"),        pos: [-24, 0, 8],   scale: 2,   ry: 0.6 },
    { path: vm("tree"),             pos: [-18, 0, 2],   scale: 1.8, ry: 3.0 },
    { path: vm("tree-high-round"),  pos: [-32, 0, 0],   scale: 2,   ry: 1.8 },
    // 동쪽 (시장 너머)
    { path: vm("tree-high"),        pos: [30,  0, -15], scale: 2,   ry: 0.4 },
    { path: vm("tree"),             pos: [30,  0, 15],  scale: 1.8, ry: 2.5 },
    // 외곽 경계
    { path: vm("tree-high"),        pos: [-36, 0, 15],  scale: 2,   ry: 1.0 },
    { path: vm("tree-high-round"),  pos: [35,  0, -18], scale: 2,   ry: 0.2 },
    { path: vm("tree-high"),        pos: [12,  0, 36],  scale: 2,   ry: 1.6 },
    { path: vm("tree"),             pos: [-15, 0, 36],  scale: 1.8, ry: 2.0 },
    { path: vm("tree-high-crooked"),pos: [14,  0, -36], scale: 2,   ry: 0.7 },
  ];

  return (
    <group>
      {trees.map(({ path, pos, scale, ry }, i) => (
        <GlbModel
          key={`tree-${i}`}
          path={path}
          position={pos}
          scale={scale ?? 2}
          rotation={[0, ry ?? 0, 0]}
        />
      ))}
    </group>
  );
}

function HedgeGardens() {
  const hedges: Array<{ path: string; pos: [number, number, number]; ry?: number }> = [
    // 분수 광장 주변
    { path: vm("hedge"),             pos: [7,   0,  0]  },
    { path: vm("hedge"),             pos: [-7,  0,  0]  },
    { path: vm("hedge-curved"),      pos: [7,   0,  7],  ry: Math.PI * 0.5 },
    { path: vm("hedge-curved"),      pos: [-7,  0,  7],  ry: Math.PI },
    { path: vm("hedge-curved"),      pos: [7,   0, -7]  },
    { path: vm("hedge-curved"),      pos: [-7,  0, -7],  ry: Math.PI * 1.5 },
    // 물레방아 근처
    { path: vm("hedge-large"),       pos: [20,  0, 30]  },
    { path: vm("hedge-large"),       pos: [22,  0, 30]  },
    { path: vm("hedge-large-curved"),pos: [30,  0, 20]  },
    // 풍차 근처
    { path: vm("hedge"),             pos: [-22, 0, -22] },
    { path: vm("hedge-large"),       pos: [-24, 0, -20] },
  ];

  return (
    <group>
      {hedges.map(({ path, pos, ry }, i) => (
        <GlbModel
          key={`hedge-${i}`}
          path={path}
          position={pos}
          rotation={[0, ry ?? 0, 0]}
        />
      ))}
    </group>
  );
}

function ScatteredRocks() {
  const rocks: Array<{ path: string; pos: [number, number, number]; scale?: number; ry?: number }> = [
    { path: vm("rock-small"), pos: [10,  0,  8],  scale: 1.5, ry: 0.4 },
    { path: vm("rock-large"), pos: [-12, 0, 10],  scale: 1.8, ry: 1.9 },
    { path: vm("rock-wide"),  pos: [14,  0, -14], scale: 1.5, ry: 0.7 },
    { path: vm("rock-small"), pos: [-16, 0, -6],  scale: 1.5, ry: 2.3 },
    { path: vm("rock-small"), pos: [8,   0, -12], scale: 1.3, ry: 1.1 },
    { path: vm("rock-large"), pos: [-20, 0, 18],  scale: 1.8, ry: 0.3 },
    { path: vm("rock-wide"),  pos: [20,  0, -22], scale: 1.5, ry: 2.8 },
    { path: vm("rock-small"), pos: [28,  0, -8],  scale: 1.3, ry: 1.5 },
  ];

  return (
    <group>
      {rocks.map(({ path, pos, scale, ry }, i) => (
        <GlbModel
          key={`rock-${i}`}
          path={path}
          position={pos}
          scale={scale ?? 2}
          rotation={[0, ry ?? 0, 0]}
        />
      ))}
    </group>
  );
}

// ─── Village Buildings ────────────────────────────────────────────────────────
//
// 타일 그리드 (scale=2 기준):
//   타일폭 T=4유닛 / 벽높이 H=4유닛
//
// 2타일 넓이 집: 코너 x=±T, 벽 중심 x=±T/2, 깊이 z=0~-2T
// 3타일 넓이 집: 코너 x=±(3T/2), 벽 중심 x=-T,0,+T, 깊이 z=0~-2T
//
// 각 면 벽 회전 (벽 기본 방향 = -Z facing):
//   전면 (facing +Z toward center): rotation-y = 0
//   뒷면 (facing -Z):               rotation-y = Math.PI
//   오른쪽 (facing +X):             rotation-y = Math.PI/2
//   왼쪽 (facing -X):               rotation-y = -Math.PI/2
//
// 코너 기본 방향 = 앞면/오른쪽 코너 (front-right: +Z,+X):
//   front-right (x=+T, z=0):        rotation-y = 0
//   front-left  (x=-T, z=0):        rotation-y = -Math.PI/2
//   back-left   (x=-T, z=-D):       rotation-y = Math.PI
//   back-right  (x=+T, z=-D):       rotation-y = Math.PI/2
//
// 지붕: roof-flat으로 전체 커버 → roof-gable로 피크 추가

const T = 4;  // 타일 폭 (scale=2)
const H = 6;  // 벽 높이 (native 3유닛 × scale=2)
const S = 2;  // scale

function VillageBuildings() {
  return (
    <group>
      <StoneCottage />
      <WoodHouse />
      <MixedHouse />
    </group>
  );
}

// ── 집 1: 석조 오두막 ──────────────────────────────────────────────────────────
// 위치: NW (-18, 0, -14) / 2×2타일 (8×8유닛) / 분수 광장 쪽 정면
function StoneCottage() {
  const D = T * 2; // 깊이 8유닛
  return (
    <group position={[-18, 0, -14]} rotation={[0, Math.PI, 0]}>

      {/* ── 전면 (z=0, facing +Z) ── */}
      <GlbModel path={vm("wall-corner")}      position={[-T,    0,  0]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall-window-glass")} position={[-T/2,  0,  0]} scale={S} />
      <GlbModel path={vm("wall-door")}         position={[ T/2,  0,  0]} scale={S} />
      <GlbModel path={vm("wall-corner")}       position={[ T,    0,  0]} scale={S} rotation={[0, 0, 0]} />

      {/* ── 왼쪽 (x=-T, facing -X) ── */}
      <GlbModel path={vm("wall")} position={[-T, 0, -T/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall")} position={[-T, 0, -3*T/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── 오른쪽 (x=+T, facing +X) ── */}
      <GlbModel path={vm("wall")} position={[T, 0, -T/2]}   scale={S} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("wall")} position={[T, 0, -3*T/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 뒷면 (z=-D, facing -Z) ── */}
      <GlbModel path={vm("wall-corner")}      position={[-T,    0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall")}              position={[-T/2,  0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall-window-stone")} position={[ T/2,  0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall-corner")}       position={[ T,    0, -D]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 지붕: roof-flat으로 전체 커버 (2×2 = 4타일) ── */}
      <GlbModel path={vm("roof-flat")} position={[-T/2, H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T/2, H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[-T/2, H, -3*T/2]} scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T/2, H, -3*T/2]} scale={S} />

      {/* ── 박공 피크: 중앙 열에 gable 타일로 지붕 뾰족하게 ── */}
      <GlbModel path={vm("roof-gable-end")} position={[-T,   H, -D/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("roof-gable")}     position={[-T/2, H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-gable")}     position={[ T/2, H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-gable-end")} position={[ T,   H, -D/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 굴뚝 ── */}
      <GlbModel path={vm("chimney")} position={[T/2, H, -T/2]} scale={S} />
    </group>
  );
}

// ── 집 2: 목조 가옥 ────────────────────────────────────────────────────────────
// 위치: NE (10, 0, -22) / 3×2타일 (12×8유닛) / 서쪽(시장 반대편) 정면
function WoodHouse() {
  const W3 = T * 1.5; // 3타일 너비에서 코너 위치 = T*1.5 = 6
  const D  = T * 2;   // 깊이 = 8
  return (
    <group position={[10, 0, -22]} rotation={[0, Math.PI, 0]}>

      {/* ── 전면 (z=0) ── */}
      <GlbModel path={vm("wall-wood-corner")}          position={[-W3,  0,  0]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall-wood-window-glass")}    position={[-T,   0,  0]} scale={S} />
      <GlbModel path={vm("wall-wood-door")}             position={[ 0,   0,  0]} scale={S} />
      <GlbModel path={vm("wall-wood-window-shutters")}  position={[ T,   0,  0]} scale={S} />
      <GlbModel path={vm("wall-wood-corner")}           position={[ W3,  0,  0]} scale={S} rotation={[0, 0, 0]} />

      {/* ── 왼쪽 (x=-W3) ── */}
      <GlbModel path={vm("wall-wood")} position={[-W3, 0, -T/2]}   scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall-wood")} position={[-W3, 0, -3*T/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── 오른쪽 (x=+W3) ── */}
      <GlbModel path={vm("wall-wood")} position={[W3, 0, -T/2]}   scale={S} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("wall-wood")} position={[W3, 0, -3*T/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 뒷면 (z=-D) ── */}
      <GlbModel path={vm("wall-wood-corner")}  position={[-W3, 0, -D]} scale={S} rotation={[0, Math.PI,     0]} />
      <GlbModel path={vm("wall-wood")}          position={[-T,  0, -D]} scale={S} rotation={[0, Math.PI,     0]} />
      <GlbModel path={vm("wall-wood")}          position={[ 0,  0, -D]} scale={S} rotation={[0, Math.PI,     0]} />
      <GlbModel path={vm("wall-wood")}          position={[ T,  0, -D]} scale={S} rotation={[0, Math.PI,     0]} />
      <GlbModel path={vm("wall-wood-corner")}   position={[ W3, 0, -D]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 지붕: roof-flat 전체 커버 (3×2 = 6타일) ── */}
      <GlbModel path={vm("roof-flat")} position={[-T,  H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ 0,  H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T,  H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[-T,  H, -3*T/2]} scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ 0,  H, -3*T/2]} scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T,  H, -3*T/2]} scale={S} />

      {/* ── 높은 박공 피크 (중앙 열) ── */}
      <GlbModel path={vm("roof-high-gable-end")} position={[-W3, H, -D/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("roof-high-gable")}     position={[-T,  H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-high-gable")}     position={[ 0,  H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-high-gable")}     position={[ T,  H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-high-gable-end")} position={[ W3, H, -D/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 굴뚝 ── */}
      <GlbModel path={vm("chimney-base")} position={[-T,  H,   -T/2]} scale={S} />
      <GlbModel path={vm("chimney-top")}  position={[-T,  H+2, -T/2]} scale={S} />

      {/* ── 발코니 (전면 외부) ── */}
      <GlbModel path={vm("balcony-wall-fence")} position={[0, 0, 1]}  scale={S} />
      <GlbModel path={vm("pillar-wood")}         position={[-T, 0, 1]} scale={S} />
      <GlbModel path={vm("pillar-wood")}         position={[ T, 0, 1]} scale={S} />
    </group>
  );
}

// ── 집 3: 아치 석조 집 ─────────────────────────────────────────────────────────
// 위치: SW (-10, 0, 18) / 2×2타일 (8×8유닛) / 분수 광장 향해 북쪽 정면
function MixedHouse() {
  const D = T * 2;
  return (
    <group position={[-10, 0, 18]} rotation={[0, 0, 0]}>

      {/* ── 전면 (z=0, facing -Z toward center) ── */}
      <GlbModel path={vm("wall-corner")}        position={[-T,    0,  0]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall-window-glass")}  position={[-T/2,  0,  0]} scale={S} />
      <GlbModel path={vm("wall-door")}           position={[ T/2,  0,  0]} scale={S} />
      <GlbModel path={vm("wall-corner")}         position={[ T,    0,  0]} scale={S} rotation={[0, 0, 0]} />

      {/* ── 왼쪽 (x=-T, facing -X) ── */}
      <GlbModel path={vm("wall")} position={[-T, 0, -T/2]}   scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("wall")} position={[-T, 0, -3*T/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />

      {/* ── 오른쪽 (x=+T, facing +X) ── */}
      <GlbModel path={vm("wall")} position={[T, 0, -T/2]}   scale={S} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("wall")} position={[T, 0, -3*T/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 뒷면 (z=-D, facing +Z) ── */}
      <GlbModel path={vm("wall-corner")}       position={[-T,    0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall")}               position={[-T/2,  0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall-window-round")}  position={[ T/2,  0, -D]} scale={S} rotation={[0, Math.PI, 0]} />
      <GlbModel path={vm("wall-corner")}        position={[ T,    0, -D]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 지붕: roof-flat 전체 커버 ── */}
      <GlbModel path={vm("roof-flat")} position={[-T/2, H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T/2, H, -T/2]}   scale={S} />
      <GlbModel path={vm("roof-flat")} position={[-T/2, H, -3*T/2]} scale={S} />
      <GlbModel path={vm("roof-flat")} position={[ T/2, H, -3*T/2]} scale={S} />

      {/* ── 박공 피크 ── */}
      <GlbModel path={vm("roof-gable-end")} position={[-T,   H, -D/2]} scale={S} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("roof-gable")}     position={[-T/2, H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-gable")}     position={[ T/2, H, -D/2]} scale={S} />
      <GlbModel path={vm("roof-gable-end")} position={[ T,   H, -D/2]} scale={S} rotation={[0, Math.PI / 2, 0]} />

      {/* ── 처마 + 기둥 (전면 장식) ── */}
      <GlbModel path={vm("overhang")}     position={[0,    H - 1, 1]}  scale={S} />
      <GlbModel path={vm("pillar-stone")} position={[-T,   0,     1]}  scale={S} />
      <GlbModel path={vm("pillar-stone")} position={[ T,   0,     1]}  scale={S} />
      <GlbModel path={vm("stall-bench")}  position={[ T+2, 0,     0.5]} scale={1.5} />
    </group>
  );
}

// ─── Character + Player ───────────────────────────────────────────────────────

function Character({ moving }: { moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(CHARACTER_MODEL);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (names.length === 0) return;
    const pickByPattern = (pattern: RegExp) =>
      names.find((name) => pattern.test(name));
    const targetName = moving
      ? pickByPattern(/walk|run|gallop/i) ?? names[0]
      : pickByPattern(/idle/i) ?? names[0];
    const action = actions[targetName];
    if (!action) return;
    action.reset().fadeIn(0.25).play();
    return () => {
      action.fadeOut(0.25);
    };
  }, [moving, actions, names]);

  return (
    <group ref={group}>
      <group rotation-y={Math.PI}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(CHARACTER_MODEL);

function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3(0, 0, 0));
  const yawRef = useRef(0);
  const pitchRef = useRef(0.4);
  const keysRef = useRef<Record<string, boolean>>({});
  const movingRef = useRef(false);
  const [moving, setMoving] = useState(false);
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();
  const tmpVec = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    const onDown = (e: MouseEvent) => {
      draggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      yawRef.current += dx * 0.005;
      pitchRef.current = clamp(pitchRef.current - dy * 0.003, PITCH_MIN, PITCH_MAX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const keys = keysRef.current;
    let forwardInput = 0;
    let strafeInput = 0;
    if (keys.KeyW || keys.ArrowUp) forwardInput += 1;
    if (keys.KeyS || keys.ArrowDown) forwardInput -= 1;
    if (keys.KeyA || keys.ArrowLeft) strafeInput -= 1;
    if (keys.KeyD || keys.ArrowRight) strafeInput += 1;

    const len = Math.hypot(forwardInput, strafeInput);
    const isMoving = len > 0;
    if (isMoving !== movingRef.current) {
      movingRef.current = isMoving;
      setMoving(isMoving);
    }
    if (len > 0) {
      forwardInput /= len;
      strafeInput /= len;
      const yaw = yawRef.current;
      const dx =
        (-Math.sin(yaw) * forwardInput + Math.cos(yaw) * strafeInput) *
        PLAYER_SPEED *
        delta;
      const dz =
        (-Math.cos(yaw) * forwardInput - Math.sin(yaw) * strafeInput) *
        PLAYER_SPEED *
        delta;
      positionRef.current.x = clamp(
        positionRef.current.x + dx,
        PLAYER_BOUNDS.minX,
        PLAYER_BOUNDS.maxX,
      );
      positionRef.current.z = clamp(
        positionRef.current.z + dz,
        PLAYER_BOUNDS.minZ,
        PLAYER_BOUNDS.maxZ,
      );

      if (groupRef.current) {
        const desiredYaw = Math.atan2(-dx, -dz);
        let diff = desiredYaw - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * Math.min(1, delta * 12);
      }
    }

    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current);
    }

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const cosP = Math.cos(pitch);
    tmpVec.set(
      positionRef.current.x + Math.sin(yaw) * cosP * CAMERA_DISTANCE,
      positionRef.current.y + Math.sin(pitch) * CAMERA_DISTANCE + CAMERA_BASE_HEIGHT,
      positionRef.current.z + Math.cos(yaw) * cosP * CAMERA_DISTANCE,
    );
    camera.position.set(
      clamp(tmpVec.x, CAMERA_BOUNDS.minX, CAMERA_BOUNDS.maxX),
      clamp(tmpVec.y, 0.5, CAMERA_MAX_Y),
      clamp(tmpVec.z, CAMERA_BOUNDS.minZ, CAMERA_BOUNDS.maxZ),
    );
    camera.lookAt(
      positionRef.current.x,
      positionRef.current.y + LOOK_AT_HEIGHT,
      positionRef.current.z,
    );
  });

  return (
    <group ref={groupRef}>
      <Character moving={moving} />
    </group>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// 마을 모델 사전 로딩
const VILLAGE_PRELOADS = [
  // 광장
  vm("fountain-round"), vm("fountain-center"), vm("lantern"),
  // 도로
  vm("road"),
  // 특수 구조물
  vm("windmill"), vm("watermill"),
  // 시장
  vm("stall"), vm("stall-green"), vm("stall-red"),
  vm("stall-bench"), vm("stall-stool"),
  vm("cart"), vm("cart-high"),
  vm("banner-red"), vm("banner-green"),
  // 자연
  vm("tree"), vm("tree-high"), vm("tree-high-round"),
  vm("tree-crooked"), vm("tree-high-crooked"),
  vm("hedge"), vm("hedge-curved"), vm("hedge-large"), vm("hedge-large-curved"),
  vm("rock-small"), vm("rock-large"), vm("rock-wide"),
  // 집 공통
  vm("roof-flat"), vm("roof-gable"), vm("roof-gable-end"),
  vm("roof-high-gable"), vm("roof-high-gable-end"),
  vm("wall-corner"), vm("wall"), vm("wall-door"), vm("wall-window-glass"),
  vm("wall-window-stone"), vm("wall-window-round"),
  vm("chimney"), vm("chimney-base"), vm("chimney-top"),
  // 목조 가옥
  vm("wall-wood-corner"), vm("wall-wood"), vm("wall-wood-door"),
  vm("wall-wood-window-glass"), vm("wall-wood-window-shutters"),
  vm("balcony-wall-fence"), vm("pillar-wood"),
  // 아치 석조 집
  vm("pillar-stone"), vm("overhang"),
];
VILLAGE_PRELOADS.forEach((path) => useGLTF.preload(path));
