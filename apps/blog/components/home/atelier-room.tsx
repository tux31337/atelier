"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { HOME_SCENE_ASSETS } from "./home-scene-assets";

const CHARACTER_MODEL = "/models/pets/animal-dog.glb";
const PARK_FOUNTAIN_MODEL = "/models/free-assets/poly-pizza-fountain/fountain.glb";
const CHARACTER_SCALE = 0.26;
const VM_BASE = "/models/GLB%20format";
const vm = (name: string) => `${VM_BASE}/${name}.glb`;

const PLAYER_SPEED = 6;
const CAMERA_DISTANCE = 6.5;
const CAMERA_BASE_HEIGHT = 2.2;
const LOOK_AT_HEIGHT = 1.1;
const PITCH_MIN = -0.3;
const PITCH_MAX = 1.25;
const PLAZA_HALF = 40;
const CAMERA_MAX_Y = 14;
const PLAYER_INSET = 0.4;
const CAMERA_INSET = 0.2;
const HOUSE_SCALE = 2.025;
const WIDE_HOUSE_SCALE = 1.98;
const VILLAGE_SPAWN = new THREE.Vector3(-8, 0, 31);
const ISLAND_SPAWN = new THREE.Vector3(0, 0.62, 8);
const VILLAGE_PORTAL = new THREE.Vector3(-9.25, 0, 24.2);
const HOUSE_PORTALS = [
  new THREE.Vector3(-20.4, 0, -23.8),
  new THREE.Vector3(17.0, 0, -31.2),
  VILLAGE_PORTAL,
  new THREE.Vector3(19.8, 0, 22.6),
];
const INTERIOR_SPAWN = new THREE.Vector3(0, 0, -30);
const INTERIOR_EXIT = new THREE.Vector3(0, 0, -35);
const PORTAL_TRIGGER_RADIUS = 1.35;
const PLAYER_RADIUS = 0.35;

type VillageObstacle =
  | {
      center: THREE.Vector2;
      half: THREE.Vector2;
      door?: THREE.Vector2;
      radius?: never;
    }
  | {
      center: THREE.Vector2;
      radius: number;
      half?: never;
      door?: never;
    };

const VILLAGE_OBSTACLES: VillageObstacle[] = [
  { center: new THREE.Vector2(0, 0), radius: 3.55 },
  { center: new THREE.Vector2(-25, -20), half: new THREE.Vector2(7.2, 7.2), door: new THREE.Vector2(-20.4, -23.8) },
  { center: new THREE.Vector2(22, -27), half: new THREE.Vector2(8.2, 7.4), door: new THREE.Vector2(17.0, -31.2) },
  { center: new THREE.Vector2(-10, 18), half: new THREE.Vector2(7.4, 8.0), door: new THREE.Vector2(VILLAGE_PORTAL.x, VILLAGE_PORTAL.z) },
  { center: new THREE.Vector2(22, 17), half: new THREE.Vector2(7.0, 7.0), door: new THREE.Vector2(19.8, 22.6) },
  { center: new THREE.Vector2(-25, -4), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(-24, 9), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(-9, -28), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(9, -29), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(25, -7), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(25, 28), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(8, 31), half: new THREE.Vector2(1.4, 1.4) },
  { center: new THREE.Vector2(-24, 28), half: new THREE.Vector2(1.4, 1.4) },
];

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

type WorldMode = "island" | "village" | "interior";

type IslandNode = {
  id: string;
  center: [number, number];
  radius: number;
  sandRadius: number;
  grass: string;
  patch: string;
  patchOffset: [number, number];
  patchRadius: number;
  rockOffset: [number, number];
  cliffDepth: number;
  accent: "atelier" | "farm" | "tower" | "beach" | "snow" | "cottage";
  modelScale: number;
  rotation: number;
};

const ISLANDS: IslandNode[] = [
  {
    id: "home",
    center: [0, 8],
    radius: 7.8,
    sandRadius: 9.2,
    grass: "#477b3f",
    patch: "#5c954d",
    patchOffset: [-1.8, 1.2],
    patchRadius: 4.4,
    rockOffset: [-3.4, -2.4],
    cliffDepth: 7.2,
    accent: "cottage",
    modelScale: 0.0043,
    rotation: 0.2,
  },
  {
    id: "castle",
    center: [0, -18],
    radius: 8.8,
    sandRadius: 10.2,
    grass: "#526f40",
    patch: "#6f9051",
    patchOffset: [1.4, 0.9],
    patchRadius: 4.1,
    rockOffset: [-3.4, 2.1],
    cliffDepth: 9.4,
    accent: "atelier",
    modelScale: 0.005,
    rotation: -0.45,
  },
  {
    id: "farm",
    center: [-22, -12],
    radius: 6.6,
    sandRadius: 7.9,
    grass: "#657f38",
    patch: "#9a8a33",
    patchOffset: [-1.1, 0.6],
    patchRadius: 2.7,
    rockOffset: [2.4, -2.0],
    cliffDepth: 7.8,
    accent: "farm",
    modelScale: 0.0038,
    rotation: 0.7,
  },
  {
    id: "tower",
    center: [22, -12],
    radius: 6.8,
    sandRadius: 8.1,
    grass: "#426d55",
    patch: "#6e9f7f",
    patchOffset: [1.2, 1.0],
    patchRadius: 3.1,
    rockOffset: [-2.8, -1.6],
    cliffDepth: 8.4,
    accent: "tower",
    modelScale: 0.0039,
    rotation: -0.25,
  },
  {
    id: "beach",
    center: [-18, 20],
    radius: 6.7,
    sandRadius: 8.8,
    grass: "#5e8b47",
    patch: "#d6c07c",
    patchOffset: [-0.6, 0.4],
    patchRadius: 4.8,
    rockOffset: [2.6, -2.2],
    cliffDepth: 8.8,
    accent: "beach",
    modelScale: 0.004,
    rotation: 0.55,
  },
  {
    id: "snow",
    center: [18, 20],
    radius: 6.9,
    sandRadius: 8.0,
    grass: "#8fa089",
    patch: "#eef2f4",
    patchOffset: [-0.7, 0.5],
    patchRadius: 4.9,
    rockOffset: [-2.6, -2.0],
    cliffDepth: 8.8,
    accent: "snow",
    modelScale: 0.004,
    rotation: -0.7,
  },
];

const BRIDGES: Array<{ from: string; to: string; width: number }> = [
  { from: "home", to: "castle", width: 2.4 },
  { from: "castle", to: "farm", width: 2.2 },
  { from: "castle", to: "tower", width: 2.2 },
  { from: "home", to: "beach", width: 2.2 },
  { from: "home", to: "snow", width: 2.2 },
  { from: "beach", to: "snow", width: 2.0 },
];

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
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none absolute left-6 top-5 z-10 max-w-sm rounded-md border border-stone-600/60 bg-[#11100f]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <p className="font-code-label text-code-label text-amber-200">Atelier Island</p>
        <h1 id="atelier-room-title" className="mt-2 font-headline-lg text-2xl text-stone-50">
          연결된 섬 작업실
        </h1>
        <p className="mt-2 font-body-md text-sm text-stone-300">
          WASD 이동 / 마우스 드래그로 시점 회전 · 다리를 따라 다른 섬으로 이동
        </p>
      </div>
    </section>
  );
}

function RoomLoading() {
  return (
    <div className="grid h-full place-items-center bg-[#090806] font-code-label text-code-label text-amber-200">
      섬을 불러오는 중
    </div>
  );
}

function Scene() {
  const [worldMode, setWorldMode] = useState<WorldMode>("island");
  const isInterior = worldMode === "interior";

  return (
    <group>
      <fog attach="fog" args={[isInterior ? "#1f1610" : "#9ed6f5", isInterior ? 18 : 38, isInterior ? 56 : 118]} />
      <color attach="background" args={[isInterior ? "#1f1610" : "#87c9ef"]} />
      <hemisphereLight args={[isInterior ? "#ffd8a8" : "#eef9ff", isInterior ? "#3a2418" : "#4b6c61", isInterior ? 1.7 : 1.65]} />
      <ambientLight intensity={isInterior ? 1.0 : 0.92} />
      <directionalLight position={[10, 20, 8]} intensity={isInterior ? 0.8 : 2.35} color={isInterior ? "#ffd8a8" : "#ffffff"} />
      <directionalLight position={[-12, 14, -6]} intensity={isInterior ? 1.1 : 0.95} color="#ffd9a3" />
      {worldMode === "island" ? null : <Ground worldMode={worldMode} />}
      {isInterior ? <HouseInterior /> : null}
      <Suspense fallback={null}>
        {worldMode === "island" ? <IslandWorld /> : null}
        {worldMode === "village" ? <VillageLayout /> : null}
      </Suspense>
      <Player worldMode={worldMode} onWarp={setWorldMode} />
    </group>
  );
}

function Ground({ worldMode }: { worldMode: WorldMode }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[PLAZA_HALF * 2, PLAZA_HALF * 2]} />
      <meshStandardMaterial color={worldMode === "interior" ? "#4a3523" : "#3d3a28"} roughness={0.98} />
    </mesh>
  );
}

// ─── Village Layout ──────────────────────────────────────────────────────────

interface GlbProps {
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  verticalAlign?: "bottom" | "top";
}

function GlbModel({ path, position, rotation = [0, 0, 0], scale = 2 }: GlbProps) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} position={position} rotation={rotation} scale={scale} />;
}

function NormalizedGlbModel({
  path,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  verticalAlign = "bottom",
}: GlbProps) {
  const { scene } = useGLTF(path);
  const { clone, offset } = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    return {
      clone,
      offset: new THREE.Vector3(
        -center.x,
        verticalAlign === "top" ? -box.max.y : -box.min.y,
        -center.z,
      ),
    };
  }, [scene, verticalAlign]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={clone} position={[offset.x, offset.y, offset.z]} />
    </group>
  );
}

function VillageLayout() {
  const showModelDistricts = false;

  return (
    <group>
      <MetaverseMapBase />
      <IslandShowcase />
      <SimpleFountainPlaza />
      <SimpleRoadNetwork />
      <HousePlatforms />
      <VillageBuildings />
      <SimpleTreeLine />
      {showModelDistricts ? (
        <>
          <FountainPlaza />
          <RoadNetwork />
          <MarketDistrict />
          <WindmillCorner />
          <WatermillCorner />
          <ScatteredTrees />
          <HedgeGardens />
          <ScatteredRocks />
        </>
      ) : null}
    </group>
  );
}

function IslandWorld() {
  return (
    <group>
      <mesh position={[0, -9.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[58, 128]} />
        <meshStandardMaterial color="#2b9bd4" roughness={0.46} metalness={0.02} transparent opacity={0.72} />
      </mesh>
      {BRIDGES.map((bridge) => (
        <IslandBridge key={`${bridge.from}-${bridge.to}`} bridge={bridge} />
      ))}
      {ISLANDS.map((island) => (
        <IslandLand key={island.id} island={island} />
      ))}
    </group>
  );
}

function IslandLand({ island }: { island: IslandNode }) {
  const [x, z] = island.center;
  const [patchX, patchZ] = island.patchOffset;
  const [rockX, rockZ] = island.rockOffset;

  return (
    <group>
      <Suspense fallback={null}>
        <NormalizedGlbModel
          path={HOME_SCENE_ASSETS.island.path}
          position={[x, 0.14, z]}
          rotation={[0, island.rotation, 0]}
          scale={island.modelScale}
          verticalAlign="top"
        />
      </Suspense>
      <mesh position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[island.radius * 0.72, 80]} />
        <meshStandardMaterial color={island.grass} roughness={0.96} transparent opacity={0.74} />
      </mesh>
      <mesh position={[x + patchX, 0.08, z + patchZ]} rotation={[-Math.PI / 2, 0, -0.25]} receiveShadow>
        <circleGeometry args={[island.patchRadius, 72]} />
        <meshStandardMaterial color={island.patch} roughness={0.94} transparent opacity={0.62} />
      </mesh>
      <IslandAccent island={island} />
      <mesh position={[x + rockX, 0.34, z + rockZ]}>
        <dodecahedronGeometry args={[0.72, 0]} />
        <meshStandardMaterial color="#7a7f76" roughness={0.82} />
      </mesh>
    </group>
  );
}

function IslandAccent({ island }: { island: IslandNode }) {
  const [x, z] = island.center;

  if (island.accent === "atelier") {
    return (
      <group position={[x, 0.14, z - 1.1]}>
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[3.2, 2.3, 2.8]} />
          <meshStandardMaterial color="#aaa28d" roughness={0.82} />
        </mesh>
        <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[2.45, 2.1, 4]} />
          <meshStandardMaterial color="#2d6fa5" roughness={0.55} />
        </mesh>
        <mesh position={[0, 3.35, 0]}>
          <cylinderGeometry args={[0.42, 0.55, 2.6, 8]} />
          <meshStandardMaterial color="#8c836e" roughness={0.82} />
        </mesh>
        <mesh position={[0, 4.9, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.9, 1.1, 4]} />
          <meshStandardMaterial color="#2d6fa5" roughness={0.55} />
        </mesh>
      </group>
    );
  }

  if (island.accent === "farm") {
    return (
      <group position={[x - 0.8, 0.15, z]}>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[2.7, 1.25, 2.2]} />
          <meshStandardMaterial color="#8b613a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.45, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.9, 1.05, 4]} />
          <meshStandardMaterial color="#2e6ca0" roughness={0.58} />
        </mesh>
        <mesh position={[2.1, 0.18, -1.4]}>
          <boxGeometry args={[2.4, 0.16, 0.8]} />
          <meshStandardMaterial color="#a88a3d" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (island.accent === "tower") {
    return (
      <group position={[x, 0.16, z]}>
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.95, 1.15, 2.8, 10]} />
          <meshStandardMaterial color="#928977" roughness={0.86} />
        </mesh>
        <mesh position={[0, 3.08, 0]}>
          <coneGeometry args={[1.28, 1.35, 10]} />
          <meshStandardMaterial color="#516673" roughness={0.7} />
        </mesh>
        <SimpleTree position={[3.0, 0, 1.9]} />
      </group>
    );
  }

  if (island.accent === "beach") {
    return (
      <group position={[x, 0.12, z]}>
        <mesh position={[-1.8, 0.65, 0.7]}>
          <boxGeometry args={[2.4, 1.3, 2]} />
          <meshStandardMaterial color="#9a6738" roughness={0.78} />
        </mesh>
        <mesh position={[-1.8, 1.5, 0.7]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.72, 1.0, 4]} />
          <meshStandardMaterial color="#2d77a6" roughness={0.55} />
        </mesh>
        <PalmTree position={[2.6, 0, -1.4]} />
      </group>
    );
  }

  if (island.accent === "snow") {
    return (
      <group position={[x, 0.13, z]}>
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[2.5, 1.3, 2.2]} />
          <meshStandardMaterial color="#85633e" roughness={0.78} />
        </mesh>
        <mesh position={[0, 1.52, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.85, 1.0, 4]} />
          <meshStandardMaterial color="#dbe4e8" roughness={0.72} />
        </mesh>
        <SimpleTree position={[-3.1, 0, -1.6]} />
      </group>
    );
  }

  return (
    <group position={[x, 0.12, z]}>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[2.5, 1.4, 2.2]} />
        <meshStandardMaterial color="#9b6338" roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.58, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.8, 1.1, 4]} />
        <meshStandardMaterial color="#a24f37" roughness={0.55} />
      </mesh>
    </group>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.0, 0]} rotation={[0.18, 0, -0.12]}>
        <cylinderGeometry args={[0.14, 0.22, 2, 8]} />
        <meshStandardMaterial color="#8b5f3a" roughness={0.78} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
        <mesh key={`palm-leaf-${angle}`} position={[Math.cos(angle) * 0.45, 2.15, Math.sin(angle) * 0.45]} rotation={[0.55, angle, 0]}>
          <coneGeometry args={[0.35, 1.4, 8]} />
          <meshStandardMaterial color="#2f8d59" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function IslandBridge({ bridge }: { bridge: { from: string; to: string; width: number } }) {
  const { start, end } = getBridgeEndpoints(bridge);
  const dx = end.x - start.x;
  const dz = end.y - start.y;
  const length = Math.hypot(dx, dz);
  const angle = Math.atan2(dx, dz);
  const plankCount = Math.max(4, Math.floor(length / 1.2));

  return (
    <group>
      <mesh
        position={[(start.x + end.x) / 2, 0.08, (start.y + end.y) / 2]}
        rotation={[-Math.PI / 2, 0, -angle]}
        receiveShadow
      >
        <boxGeometry args={[bridge.width * 0.78, length, 0.1]} />
        <meshStandardMaterial color="#8b633f" roughness={0.88} />
      </mesh>
      {Array.from({ length: plankCount }, (_, index) => {
        const t = (index + 0.5) / plankCount;
        const px = start.x + dx * t;
        const pz = start.y + dz * t;
        return (
          <mesh key={`bridge-plank-${bridge.from}-${bridge.to}-${index}`} position={[px, 0.18, pz]} rotation={[0, angle, 0]}>
            <boxGeometry args={[bridge.width, 0.08, 0.42]} />
            <meshStandardMaterial color={index % 2 === 0 ? "#b98755" : "#a9794b"} roughness={0.84} />
          </mesh>
        );
      })}
      {[-1, 1].map((side) => (
        <mesh
          key={`bridge-rope-${bridge.from}-${bridge.to}-${side}`}
          position={[(start.x + end.x) / 2 + Math.cos(angle) * bridge.width * 0.58 * side, 0.55, (start.y + end.y) / 2 - Math.sin(angle) * bridge.width * 0.58 * side]}
          rotation={[-Math.PI / 2, 0, -angle]}
        >
          <boxGeometry args={[0.08, length, 0.08]} />
          <meshStandardMaterial color="#6d4a2e" roughness={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function IslandShowcase() {
  const island = HOME_SCENE_ASSETS.island;

  return (
    <group position={island.position}>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.6, 56]} />
        <meshStandardMaterial color="#222f36" roughness={0.72} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.25, 3.6, 56]} />
        <meshStandardMaterial color="#77e6d2" emissive="#1e9d8f" emissiveIntensity={0.22} roughness={0.42} />
      </mesh>
      <Suspense fallback={null}>
        <NormalizedGlbModel
          path={island.path}
          position={[0, 0.16, 0]}
          rotation={island.rotation}
          scale={island.scale}
        />
      </Suspense>
    </group>
  );
}

function MetaverseMapBase() {
  return (
    <group>
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[37, 96]} />
        <meshStandardMaterial color="#486b3c" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[33.5, 34.2, 96]} />
        <meshStandardMaterial color="#7c8b55" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.5, 10.2, 80]} />
        <meshStandardMaterial color="#b9a06d" roughness={0.86} />
      </mesh>
    </group>
  );
}

function HousePlatforms() {
  const pads: Array<{
    position: [number, number, number];
    color: string;
    ring: string;
  }> = [
    { position: [-25, 0, -20], color: "#6f7e50", ring: "#d4a157" },
    { position: [22, 0, -27], color: "#66755d", ring: "#7cc6c9" },
    { position: [-10, 0, 18], color: "#657856", ring: "#b88cff" },
    { position: [22, 0, 17], color: "#607b78", ring: "#9bd7ff" },
  ];

  return (
    <group>
      {pads.map((pad) => (
        <group key={`${pad.position[0]}-${pad.position[2]}`} position={pad.position}>
          <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[10, 64]} />
            <meshStandardMaterial color={pad.color} roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[9.4, 9.8, 64]} />
            <meshStandardMaterial color={pad.ring} emissive={pad.ring} emissiveIntensity={0.08} />
          </mesh>
        </group>
      ))}
      {HOUSE_PORTALS.map((portal, index) => (
        <mesh
          key={`door-pad-${index}`}
          position={[portal.x, 0.075, portal.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.25, 1.55, 40]} />
          <meshStandardMaterial color="#e9d5ff" emissive="#a855f7" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function SimpleFountainPlaza() {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.4, 72]} />
        <meshStandardMaterial color="#b9ad94" roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.4, 6.3, 72]} />
        <meshStandardMaterial color="#7f6f4f" roughness={0.9} />
      </mesh>
      <GlbModel path={PARK_FOUNTAIN_MODEL} position={[0, 0.08, 0]} rotation={[0, -0.45, 0]} scale={3.4} />
      <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.15, 64]} />
        <meshStandardMaterial
          color="#5ea0b3"
          roughness={0.28}
          metalness={0.02}
          transparent
          opacity={0.58}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.15, 0.025, 8, 72]} />
        <meshStandardMaterial color="#d7f4ff" emissive="#60a5fa" emissiveIntensity={0.35} />
      </mesh>
      <AnimatedFountainWater />
      <pointLight position={[0, 3.4, 0]} intensity={1.35} distance={12} color="#c7f9ff" />
    </group>
  );
}

function AnimatedFountainWater() {
  const rippleRefs = useRef<Array<THREE.Mesh | null>>([]);
  const streamRefs = useRef<Array<THREE.Mesh | null>>([]);
  const waterSourceY = 5.18;
  const basinY = 0.82;
  const sprayCount = 12;
  const beadsPerStream = 7;
  const streamCount = sprayCount * beadsPerStream;

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    rippleRefs.current.forEach((ripple, index) => {
      if (!ripple) return;
      const progress = (time * 0.62 + index / 3) % 1;
      const scale = 0.65 + progress * 2.15;
      ripple.scale.set(scale, scale, scale);
      const material = ripple.material;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.opacity = 0.26 * (1 - progress);
      }
    });

    streamRefs.current.forEach((bead, index) => {
      if (!bead) return;
      const lane = Math.floor(index / beadsPerStream);
      const beadIndex = index % beadsPerStream;
      const cycle = ((beadIndex / beadsPerStream) + time * 0.62) % 1;
      const angle = lane * ((Math.PI * 2) / sprayCount) + time * 0.14;
      const radius = 0.16 + cycle * 1.55;
      const y = waterSourceY - (waterSourceY - basinY) * cycle + Math.sin(cycle * Math.PI) * 0.42;

      bead.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      );
      bead.scale.setScalar(0.045 + (1 - cycle) * 0.035);
      const material = bead.material;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.opacity = 0.72 - cycle * 0.28;
      }
    });
  });

  return (
    <group>
      <mesh position={[0, waterSourceY, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#effcff"
          emissive="#7dd3fc"
          emissiveIntensity={0.8}
          roughness={0.16}
          transparent
          opacity={0.72}
        />
      </mesh>
      <mesh position={[0, waterSourceY - 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.018, 8, 48]} />
        <meshStandardMaterial
          color="#effcff"
          emissive="#7dd3fc"
          emissiveIntensity={0.5}
          roughness={0.18}
          transparent
          opacity={0.5}
        />
      </mesh>
      {Array.from({ length: streamCount }, (_, index) => (
        <mesh
          key={`fountain-stream-${index}`}
          ref={(mesh) => {
            streamRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#dffbff"
            emissive="#38bdf8"
            emissiveIntensity={0.35}
            roughness={0.12}
            transparent
            opacity={0.64}
          />
        </mesh>
      ))}
      {Array.from({ length: 3 }, (_, index) => (
        <mesh
          key={`fountain-ripple-${index}`}
          ref={(mesh) => {
            rippleRefs.current[index] = mesh;
          }}
          position={[0, 0.24 + index * 0.012, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.72, 0.018, 8, 72]} />
          <meshStandardMaterial
            color="#d7f4ff"
            emissive="#38bdf8"
            emissiveIntensity={0.24}
            roughness={0.2}
            transparent
            opacity={0.28}
          />
        </mesh>
      ))}
    </group>
  );
}

function SimpleRoadNetwork() {
  const roads: Array<{
    position: [number, number, number];
    length: number;
    rotation: number;
  }> = [
    { position: [0, 0.03, 0], length: 54, rotation: 0 },
    { position: [0, 0.035, 0], length: 54, rotation: Math.PI / 2 },
    { position: [-12.5, 0.04, -10], length: 28, rotation: -0.9 },
    { position: [11, 0.041, -13.5], length: 31, rotation: 0.68 },
    { position: [-5, 0.042, 9], length: 21, rotation: 0.45 },
    { position: [11, 0.043, 8.5], length: 25, rotation: -0.8 },
  ];

  return (
    <group>
      {roads.map((road, index) => (
        <mesh
          key={`village-road-${index}`}
          position={road.position}
          rotation={[-Math.PI / 2, 0, road.rotation]}
        >
          <boxGeometry args={[4.6, road.length, 0.08]} />
          <meshStandardMaterial color="#a58b5e" roughness={0.92} />
        </mesh>
      ))}
    </group>
  );
}

function SimpleTreeLine() {
  const trees: Array<[number, number, number]> = [
    [-25, 0, -4],
    [-24, 0, 9],
    [-9, 0, -28],
    [9, 0, -29],
    [25, 0, -7],
    [25, 0, 28],
    [8, 0, 31],
    [-24, 0, 28],
    [-33, 0, -28],
    [-33, 0, 28],
    [33, 0, -28],
    [33, 0, 28],
  ];

  return (
    <group>
      {trees.map((position, index) => (
        <SimpleTree key={`simple-tree-${index}`} position={position} />
      ))}
    </group>
  );
}

function SimpleTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.28, 0.42, 3, 10]} />
        <meshStandardMaterial color="#8b5f3a" roughness={0.78} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <coneGeometry args={[1.55, 3.2, 12]} />
        <meshStandardMaterial color="#2f8d59" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5.0, 0]}>
        <coneGeometry args={[1.15, 2.6, 12]} />
        <meshStandardMaterial color="#36a66a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function HouseInterior() {
  return (
    <group>
      <PortalDoor position={INTERIOR_EXIT.toArray() as [number, number, number]} color="#ffc46b" />
      <mesh position={[0, 0.05, -30]}>
        <boxGeometry args={[16, 0.1, 14]} />
        <meshStandardMaterial color="#6c4a2e" roughness={0.85} />
      </mesh>
      <InteriorWall position={[0, 2.6, -37]} size={[16, 5.2, 0.3]} />
      <InteriorWall position={[-8, 2.6, -30]} size={[0.3, 5.2, 14]} />
      <InteriorWall position={[8, 2.6, -30]} size={[0.3, 5.2, 14]} />
      <InteriorWall position={[0, 2.6, -23]} size={[16, 5.2, 0.3]} />
      <mesh position={[0, 5.3, -30]}>
        <boxGeometry args={[17, 0.35, 15]} />
        <meshStandardMaterial color="#3a2418" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.11, -30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#8f3e35" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, -30]}>
        <boxGeometry args={[2.8, 1.4, 1.6]} />
        <meshStandardMaterial color="#8b5a33" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.55, -30]}>
        <boxGeometry args={[3.4, 0.25, 2.0]} />
        <meshStandardMaterial color="#ad7842" roughness={0.75} />
      </mesh>
      <mesh position={[-5.8, 1.05, -33.5]}>
        <boxGeometry args={[2.8, 1.6, 2.0]} />
        <meshStandardMaterial color="#8d6a4b" roughness={0.85} />
      </mesh>
      <mesh position={[-5.8, 1.92, -33.5]}>
        <boxGeometry args={[3.0, 0.28, 2.2]} />
        <meshStandardMaterial color="#d0b083" roughness={0.8} />
      </mesh>
      <mesh position={[5.9, 1.8, -34.9]}>
        <boxGeometry args={[2.8, 3.2, 0.35]} />
        <meshStandardMaterial color="#715032" roughness={0.82} />
      </mesh>
      {[0.8, 1.8, 2.8].map((y) => (
        <mesh key={`shelf-${y}`} position={[5.9, y, -34.65]}>
          <boxGeometry args={[2.5, 0.16, 0.32]} />
          <meshStandardMaterial color="#c58c4b" roughness={0.78} />
        </mesh>
      ))}
      <mesh position={[0, 1.8, -36.78]}>
        <boxGeometry args={[2.4, 2.2, 0.18]} />
        <meshStandardMaterial color="#ffd27a" emissive="#e88a2f" emissiveIntensity={0.55} roughness={0.5} />
      </mesh>
      <pointLight position={[0, 2.8, -32]} intensity={2.4} distance={13} color="#ffc46b" />
      <pointLight position={[0, 1.8, -36]} intensity={2.0} distance={8} color="#ff8a3d" />
    </group>
  );
}

function InteriorWall({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#7d5738" roughness={0.88} />
    </mesh>
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
      <ReadableStoneCottage />
      <ReadableWoodHouse />
      <ReadableGardenHouse />
      <ReadableBlueCottage />
    </group>
  );
}

// ── 집 1: 석조 오두막 ──────────────────────────────────────────────────────────
// 위치: NW (-18, 0, -14) / 2×2타일 (8×8유닛) / 분수 광장 쪽 정면
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      <GlbModel path={vm("roof-window")} position={[-T/2, H + 0.35, -D/2]} scale={1.6} />
      <GlbModel path={vm("stairs-stone")} position={[T/2, 0, 2.1]} scale={1.35} />
      <GlbModel path={vm("lantern")} position={[T + 1.3, 0, 1.7]} scale={1.5} />
      <GlbModel path={vm("lantern")} position={[-T - 1.3, 0, 1.7]} scale={1.5} />
      <pointLight position={[T + 1.3, 2.5, 1.7]} intensity={1.4} distance={6} color="#ffc66d" />
      <pointLight position={[-T - 1.3, 2.5, 1.7]} intensity={1.2} distance={6} color="#ffc66d" />
      <GlbModel path={vm("fence-gate")} position={[T/2, 0, 5]} scale={1.45} />
      <GlbModel path={vm("fence")} position={[-T/2, 0, 5]} scale={1.45} />
      <GlbModel path={vm("fence")} position={[-T - 2, 0, 2.5]} scale={1.45} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("hedge-curved")} position={[T + 1.5, 0, 4.3]} scale={1.6} />
      <GlbModel path={vm("stall-bench")} position={[-T - 1.2, 0, 0.6]} scale={1.25} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

// ── 집 2: 목조 가옥 ────────────────────────────────────────────────────────────
// 위치: NE (10, 0, -22) / 3×2타일 (12×8유닛) / 서쪽(시장 반대편) 정면
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      <GlbModel path={vm("roof-high-window")} position={[T, H + 0.45, -D/2]} scale={1.55} />
      <GlbModel path={vm("roof-high-gable-detail")} position={[0, H + 0.15, -D/2]} scale={1.75} />
      <GlbModel path={vm("stairs-wide-wood")} position={[0, 0, 2.4]} scale={1.3} />
      <GlbModel path={vm("balcony-wall")} position={[-T, 0, 2.6]} scale={1.25} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("balcony-wall")} position={[T, 0, 2.6]} scale={1.25} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("planks-half")} position={[-W3 - 1.6, 0, -2]} scale={1.35} rotation={[0, 0.35, 0]} />
      <GlbModel path={vm("cart")} position={[W3 + 2.6, 0, 1.8]} scale={1.25} rotation={[0, -0.75, 0]} />
      <GlbModel path={vm("lantern")} position={[-W3 - 1.5, 0, 1.5]} scale={1.45} />
      <GlbModel path={vm("lantern")} position={[W3 + 1.5, 0, 1.5]} scale={1.45} />
      <pointLight position={[-W3 - 1.5, 2.6, 1.5]} intensity={1.3} distance={6} color="#ffd17f" />
      <pointLight position={[W3 + 1.5, 2.6, 1.5]} intensity={1.3} distance={6} color="#ffd17f" />
    </group>
  );
}

// ── 집 3: 아치 석조 집 ─────────────────────────────────────────────────────────
// 위치: SW (-10, 0, 18) / 2×2타일 (8×8유닛) / 분수 광장 향해 북쪽 정면
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <GlbModel path={vm("roof-gable-detail")} position={[T/2, H + 0.15, -D/2]} scale={1.65} />
      <GlbModel path={vm("roof-window")} position={[-T/2, H + 0.35, -D/2]} scale={1.55} />
      <GlbModel path={vm("stairs-wide-stone")} position={[T/2, 0, 2.5]} scale={1.35} />
      <GlbModel path={vm("hedge-gate")} position={[T/2, 0, 5.2]} scale={1.55} />
      <GlbModel path={vm("hedge")} position={[-T/2, 0, 5.2]} scale={1.55} />
      <GlbModel path={vm("hedge")} position={[T + 2.2, 0, 3.1]} scale={1.55} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("stall-stool")} position={[-T - 1.2, 0, 1.2]} scale={1.25} />
      <GlbModel path={vm("planks")} position={[-T - 2.2, 0, -2.8]} scale={1.2} rotation={[0, -0.5, 0]} />
      <GlbModel path={vm("lantern")} position={[-T - 1.2, 0, 1.8]} scale={1.45} />
      <pointLight position={[-T - 1.2, 2.6, 1.8]} intensity={1.4} distance={6} color="#ffce7a" />
    </group>
  );
}

// ─── Character + Player ───────────────────────────────────────────────────────

function ReadableStoneCottage() {
  return (
    <group position={[-25, 0, -20]} rotation={[0, Math.PI * 0.72, 0]} scale={HOUSE_SCALE}>
      <CottageHouse
        wallColor="#d8c4a1"
        roofColor="#9a3f2f"
        trimColor="#f2e5c8"
        doorColor="#6d4327"
      />
      <PortalDoor position={[0, 1.8, 2.98]} color="#f59e0b" />
      <GlbModel path={vm("fence-gate")} position={[0, 0, 8]} scale={1.55} />
      <GlbModel path={vm("fence")} position={[-3, 0, 8]} scale={1.55} />
      <GlbModel path={vm("fence")} position={[3, 0, 8]} scale={1.55} />
      <GlbModel path={vm("fence")} position={[-5, 0, 5.5]} scale={1.55} rotation={[0, Math.PI / 2, 0]} />
      <GlbModel path={vm("lantern")} position={[-3.7, 0, 3.8]} scale={1.45} />
      <pointLight position={[-3.7, 2.5, 3.8]} intensity={1.2} distance={7} color="#ffc66d" />
    </group>
  );
}

function ReadableWoodHouse() {
  return (
    <group position={[22, 0, -27]} rotation={[0, -Math.PI * 0.72, 0]} scale={WIDE_HOUSE_SCALE}>
      <CottageHouse
        width={7.5}
        depth={6.5}
        height={4.2}
        wallColor="#b78354"
        roofColor="#3f5f66"
        trimColor="#f4d6a0"
        doorColor="#3f2a1d"
      />
      <PortalDoor position={[0, 1.9, 3.34]} color="#67e8f9" />
      <GlbModel path={vm("cart")} position={[5.8, 0, 3.8]} scale={1.3} rotation={[0, -0.65, 0]} />
      <GlbModel path={vm("planks-half")} position={[-5.5, 0, -1]} scale={1.35} rotation={[0, 0.35, 0]} />
      <GlbModel path={vm("lantern")} position={[4.25, 0, 3.7]} scale={1.45} />
      <pointLight position={[4.25, 2.5, 3.7]} intensity={1.25} distance={7} color="#ffd17f" />
    </group>
  );
}

function ReadableGardenHouse() {
  return (
    <group position={[-10, 0, 18]} rotation={[0, Math.PI * 0.12, 0]} scale={HOUSE_SCALE}>
      <HouseFoundation width={8.1} depth={7.4} height={0.75} />
      <group position={[0, 0.75, 0]}>
        <CottageHouse
          width={6.5}
          depth={6}
          height={3.9}
          wallColor="#c7d4c2"
          roofColor="#5b3f7a"
          trimColor="#f5ecd9"
          doorColor="#51402e"
        />
        <PortalDoor position={[0, 1.8, 3.13]} color="#b88cff" />
      </group>
      <SimpleSteps position={[0, 0, 4.7]} width={2.8} depth={2.2} height={0.75} steps={4} />
      <GlbModel path={vm("hedge-gate")} position={[0, 0, 7.5]} scale={1.5} />
      <GlbModel path={vm("hedge")} position={[-3, 0, 7.5]} scale={1.5} />
      <GlbModel path={vm("hedge")} position={[3, 0, 7.5]} scale={1.5} />
      <GlbModel path={vm("stall-bench")} position={[4.8, 0, 2.8]} scale={1.25} rotation={[0, -Math.PI / 2, 0]} />
      <GlbModel path={vm("lantern")} position={[-4.1, 0, 3.2]} scale={1.45} />
      <pointLight position={[-4.1, 2.5, 3.2]} intensity={1.3} distance={7} color="#ffce7a" />
    </group>
  );
}

function ReadableBlueCottage() {
  return (
    <group position={[22, 0, 17]} rotation={[0, -Math.PI * 0.12, 0]} scale={HOUSE_SCALE}>
      <CottageHouse
        width={6.2}
        depth={5.9}
        height={3.8}
        wallColor="#b8cad5"
        roofColor="#2f5572"
        trimColor="#edf4ef"
        doorColor="#39485c"
      />
      <PortalDoor position={[0, 1.8, 3.04]} color="#9bd7ff" />
      <GlbModel path={vm("fence")} position={[-3, 0, 7.4]} scale={1.45} />
      <GlbModel path={vm("fence-gate")} position={[0, 0, 7.4]} scale={1.45} />
      <GlbModel path={vm("fence")} position={[3, 0, 7.4]} scale={1.45} />
      <GlbModel path={vm("lantern")} position={[3.7, 0, 3.6]} scale={1.35} />
      <pointLight position={[3.7, 2.4, 3.6]} intensity={1.15} distance={7} color="#cce7ff" />
    </group>
  );
}

interface CottageHouseProps {
  width?: number;
  depth?: number;
  height?: number;
  wallColor: string;
  roofColor: string;
  trimColor: string;
  doorColor: string;
}

function CottageHouse({
  width = 6,
  depth = 5.8,
  height = 3.8,
  wallColor,
  roofColor,
  trimColor,
  doorColor,
}: CottageHouseProps) {
  const roofHeight = height * 0.72;
  const frontZ = depth / 2 + 0.04;
  const sideX = width / 2 + 0.04;

  return (
    <group>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.72} />
      </mesh>
      <mesh position={[0, height + roofHeight / 2 - 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[Math.max(width, depth) * 0.82, roofHeight, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.58} />
      </mesh>
      <mesh position={[0, height + 0.22, frontZ]}>
        <boxGeometry args={[width * 1.12, 0.34, 0.28]} />
        <meshStandardMaterial color={trimColor} roughness={0.64} />
      </mesh>
      <mesh position={[0, 1.2, frontZ]}>
        <boxGeometry args={[1.25, 2.4, 0.18]} />
        <meshStandardMaterial color={doorColor} roughness={0.78} />
      </mesh>
      <mesh position={[0.38, 1.25, frontZ + 0.1]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#f7d17d" emissive="#f7b84a" emissiveIntensity={0.5} />
      </mesh>
      <HouseWindow position={[-width * 0.3, 2.2, frontZ]} trimColor={trimColor} />
      <HouseWindow position={[width * 0.3, 2.2, frontZ]} trimColor={trimColor} />
      <HouseWindow position={[-sideX, 2.15, -depth * 0.12]} rotationY={Math.PI / 2} trimColor={trimColor} />
      <HouseWindow position={[sideX, 2.15, -depth * 0.12]} rotationY={Math.PI / 2} trimColor={trimColor} />
      <mesh position={[width * 0.28, height + roofHeight * 0.28, -depth * 0.14]}>
        <boxGeometry args={[0.72, 1.35, 0.72]} />
        <meshStandardMaterial color="#6f4b38" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, 4.4]}>
        <boxGeometry args={[2.6, 0.16, 2.4]} />
        <meshStandardMaterial color="#8b8062" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 2.8, frontZ + 0.65]} intensity={0.7} distance={5} color="#ffd27a" />
    </group>
  );
}

function HouseFoundation({
  width,
  depth,
  height,
}: {
  width: number;
  depth: number;
  height: number;
}) {
  return (
    <group>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#756b57" roughness={0.94} />
      </mesh>
      <mesh position={[0, height + 0.04, 0]}>
        <boxGeometry args={[width + 0.35, 0.12, depth + 0.35]} />
        <meshStandardMaterial color="#a09476" roughness={0.9} />
      </mesh>
    </group>
  );
}

function SimpleSteps({
  position,
  width,
  depth,
  height,
  steps,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  steps: number;
}) {
  const stepDepth = depth / steps;
  const stepHeight = height / steps;

  return (
    <group position={position}>
      {Array.from({ length: steps }, (_, index) => {
        const currentDepth = stepDepth * (index + 1);
        const currentHeight = stepHeight * (index + 1);
        const z = depth / 2 - currentDepth / 2;

        return (
          <mesh key={`portal-step-${index}`} position={[0, currentHeight / 2, z]}>
            <boxGeometry args={[width, currentHeight, currentDepth]} />
            <meshStandardMaterial color="#9c9279" roughness={0.92} />
          </mesh>
        );
      })}
    </group>
  );
}

function PortalDoor({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0.08]}>
        <boxGeometry args={[1.62, 2.88, 0.18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.75}
          roughness={0.3}
          transparent
          opacity={0.64}
        />
      </mesh>
      <mesh position={[0, 2.12, 0.11]}>
        <torusGeometry args={[0.88, 0.08, 12, 36, Math.PI]} />
        <meshStandardMaterial color="#f7e8ff" emissive={color} emissiveIntensity={0.9} />
      </mesh>
      <mesh position={[-0.9, 0.72, 0.1]}>
        <boxGeometry args={[0.14, 2.8, 0.16]} />
        <meshStandardMaterial color="#f7e8ff" emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0.9, 0.72, 0.1]}>
        <boxGeometry args={[0.14, 2.8, 0.16]} />
        <meshStandardMaterial color="#f7e8ff" emissive={color} emissiveIntensity={0.55} />
      </mesh>
      <pointLight position={[0, 1.6, 0.7]} intensity={1.8} distance={6} color={color} />
    </group>
  );
}

function HouseWindow({
  position,
  rotationY = 0,
  trimColor,
}: {
  position: [number, number, number];
  rotationY?: number;
  trimColor: string;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[1.15, 1.0, 0.16]} />
        <meshStandardMaterial color={trimColor} roughness={0.62} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[0.82, 0.68, 0.08]} />
        <meshStandardMaterial color="#f4d58b" emissive="#f0b64a" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.09, 0.76, 0.08]} />
        <meshStandardMaterial color="#755139" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[0.9, 0.08, 0.08]} />
        <meshStandardMaterial color="#755139" roughness={0.72} />
      </mesh>
    </group>
  );
}

function Character({ moving }: { moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(CHARACTER_MODEL);
  const { actions, names } = useAnimations(animations, group);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pace = moving ? 12 : 2.5;
    const lift = moving ? 0.025 : 0.008;
    group.current.position.y = Math.max(0, Math.sin(clock.elapsedTime * pace) * lift);
    group.current.rotation.z = moving ? Math.sin(clock.elapsedTime * 10) * 0.035 : 0;
  });

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
    <group ref={group} scale={CHARACTER_SCALE}>
      <group rotation-y={Math.PI}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(CHARACTER_MODEL);
useGLTF.preload(PARK_FOUNTAIN_MODEL);
useGLTF.preload(HOME_SCENE_ASSETS.island.path);

function Player({
  worldMode,
  onWarp,
}: {
  worldMode: WorldMode;
  onWarp: (mode: WorldMode) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef(getSpawnPosition(worldMode));
  const yawRef = useRef(0);
  const pitchRef = useRef(0.4);
  const keysRef = useRef<Record<string, boolean>>({});
  const movingRef = useRef(false);
  const warpCooldownRef = useRef(0);
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
    warpCooldownRef.current = Math.max(0, warpCooldownRef.current - delta);
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
      const nextPosition = getNextPlayerPosition(
        positionRef.current.x + dx,
        positionRef.current.z + dz,
        worldMode,
      );

      if (!isBlocked(nextPosition, worldMode)) {
        positionRef.current.copy(nextPosition);
      }

      if (groupRef.current) {
        const desiredYaw = Math.atan2(-dx, -dz);
        let diff = desiredYaw - groupRef.current.rotation.y;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        groupRef.current.rotation.y += diff * Math.min(1, delta * 12);
      }
    }

    if (worldMode !== "island" && warpCooldownRef.current === 0) {
      if (
        worldMode === "village" &&
        HOUSE_PORTALS.some((portal) => positionRef.current.distanceTo(portal) < PORTAL_TRIGGER_RADIUS)
      ) {
        positionRef.current.copy(INTERIOR_SPAWN);
        yawRef.current = 0;
        warpCooldownRef.current = 1.2;
        onWarp("interior");
      } else if (
        worldMode === "interior" &&
        positionRef.current.distanceTo(INTERIOR_EXIT) < PORTAL_TRIGGER_RADIUS
      ) {
        positionRef.current.copy(VILLAGE_SPAWN);
        yawRef.current = 0;
        warpCooldownRef.current = 1.2;
        onWarp("village");
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

function getSpawnPosition(worldMode: WorldMode) {
  return worldMode === "island" ? ISLAND_SPAWN.clone() : VILLAGE_SPAWN.clone();
}

function getNextPlayerPosition(x: number, z: number, worldMode: WorldMode) {
  if (worldMode === "island") {
    return new THREE.Vector3(x, ISLAND_SPAWN.y, z);
  }

  return new THREE.Vector3(
    clamp(x, PLAYER_BOUNDS.minX, PLAYER_BOUNDS.maxX),
    0,
    clamp(z, PLAYER_BOUNDS.minZ, PLAYER_BOUNDS.maxZ),
  );
}

function isBlocked(position: THREE.Vector3, worldMode: WorldMode) {
  if (worldMode === "island") {
    return !isInIslandWorldBounds(position.x, position.z);
  }

  if (worldMode === "interior") {
    return Math.abs(position.x) > 7.4 || position.z < -36.5 || position.z > -23.5;
  }

  const point = new THREE.Vector2(position.x, position.z);

  return VILLAGE_OBSTACLES.some((obstacle) => {
    if (obstacle.radius !== undefined) {
      return point.distanceTo(obstacle.center) < obstacle.radius + PLAYER_RADIUS;
    }

    if (obstacle.door && point.distanceTo(obstacle.door) < PORTAL_TRIGGER_RADIUS + 0.45) {
      return false;
    }

    return (
      Math.abs(point.x - obstacle.center.x) < obstacle.half.x + PLAYER_RADIUS &&
      Math.abs(point.y - obstacle.center.y) < obstacle.half.y + PLAYER_RADIUS
    );
  });
}

function isInIslandWorldBounds(x: number, z: number) {
  return isOnAnyIsland(x, z) || isOnAnyBridge(x, z);
}

function isOnAnyIsland(x: number, z: number) {
  return ISLANDS.some((island) => {
    const dx = x - island.center[0];
    const dz = z - island.center[1];
    return Math.hypot(dx, dz) <= island.radius - PLAYER_RADIUS * 0.5;
  });
}

function isOnAnyBridge(x: number, z: number) {
  return BRIDGES.some((bridge) => {
    const { start, end } = getBridgeEndpoints(bridge);
    const ax = start.x;
    const az = start.y;
    const bx = end.x;
    const bz = end.y;
    const vx = bx - ax;
    const vz = bz - az;
    const lengthSq = vx * vx + vz * vz;
    const t = clamp(((x - ax) * vx + (z - az) * vz) / lengthSq, 0, 1);
    const closestX = ax + vx * t;
    const closestZ = az + vz * t;
    const distance = Math.hypot(x - closestX, z - closestZ);

    return distance <= bridge.width / 2 - PLAYER_RADIUS * 0.3;
  });
}

function getIslandById(id: string) {
  const island = ISLANDS.find((candidate) => candidate.id === id);
  if (!island) {
    throw new Error(`Unknown island id: ${id}`);
  }
  return island;
}

function getBridgeEndpoints(bridge: { from: string; to: string; width: number }) {
  const from = getIslandById(bridge.from);
  const to = getIslandById(bridge.to);
  const dx = to.center[0] - from.center[0];
  const dz = to.center[1] - from.center[1];
  const length = Math.hypot(dx, dz);
  const ux = dx / length;
  const uz = dz / length;

  return {
    start: new THREE.Vector2(
      from.center[0] + ux * (from.radius - 0.7),
      from.center[1] + uz * (from.radius - 0.7),
    ),
    end: new THREE.Vector2(
      to.center[0] - ux * (to.radius - 0.7),
      to.center[1] - uz * (to.radius - 0.7),
    ),
  };
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
  // 목조 가옥
  // 아치 석조 집
  vm("balcony-wall"), vm("fence"), vm("fence-gate"),
  vm("hedge-gate"), vm("planks"), vm("planks-half"),
  vm("stairs-stone"), vm("stairs-wide-stone"), vm("stairs-wide-wood"),
];
const ACTIVE_VILLAGE_PRELOADS = new Set([
  vm("cart"),
  vm("fence"),
  vm("fence-gate"),
  vm("hedge"),
  vm("hedge-gate"),
  vm("lantern"),
  vm("planks-half"),
  vm("stall-bench"),
]);
VILLAGE_PRELOADS.filter((path) => ACTIVE_VILLAGE_PRELOADS.has(path)).forEach((path) =>
  useGLTF.preload(path),
);
