"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ROOM_ROUTES } from "./room-routes";

const CHARACTER_MODEL = "/models/Wolf.glb";

const PLAYER_SPEED = 6;
const CAMERA_DISTANCE = 5;
const CAMERA_BASE_HEIGHT = 1.8;
const LOOK_AT_HEIGHT = 1.0;
const PITCH_MIN = -0.3;
const PITCH_MAX = 1.25;
const PLAZA_HALF = 15;
const WALL_HEIGHT = 5;
const WALL_CENTER_Y = WALL_HEIGHT / 2;
const PLAYER_INSET = 0.4;
const CAMERA_INSET = 0.2;
const CAMERA_MAX_Y = WALL_HEIGHT + 1.5;
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
            <fog attach="fog" args={["#1a1d2a", 18, 38]} />
            <color attach="background" args={["#1a1d2a"]} />
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none absolute left-6 top-5 z-10 max-w-sm rounded-md border border-stone-600/60 bg-[#11100f]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <p className="font-code-label text-code-label text-amber-200">Atelier Plaza</p>
        <h1 id="atelier-room-title" className="mt-2 font-headline-lg text-2xl text-stone-50">
          오픈월드 광장 프로토타입
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
      광장을 준비하는 중
    </div>
  );
}

function Scene() {
  return (
    <group>
      <hemisphereLight args={["#aab7d6", "#3a2a1f", 1.6]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[8, 18, 6]} intensity={2.4} />
      <directionalLight position={[-10, 14, -4]} intensity={1.2} color="#ffd9a3" />
      <Ground />
      <RoutePatches />
      <PerimeterWalls />
      {ROOM_ROUTES.map((route) => (
        <RouteMarker key={route.id} position={route.position} accent={route.accent} />
      ))}
      <Player />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[PLAZA_HALF * 2, PLAZA_HALF * 2]} />
      <meshStandardMaterial color="#3a3530" roughness={0.95} />
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

function PerimeterWalls() {
  return (
    <group>
      <mesh position={[0, WALL_CENTER_Y, -PLAZA_HALF]}>
        <boxGeometry args={[PLAZA_HALF * 2, WALL_HEIGHT, 0.3]} />
        <meshStandardMaterial color="#2c303d" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, WALL_CENTER_Y, PLAZA_HALF]}>
        <boxGeometry args={[PLAZA_HALF * 2, WALL_HEIGHT, 0.3]} />
        <meshStandardMaterial color="#2c303d" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-PLAZA_HALF, WALL_CENTER_Y, 0]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, PLAZA_HALF * 2]} />
        <meshStandardMaterial color="#2c303d" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[PLAZA_HALF, WALL_CENTER_Y, 0]}>
        <boxGeometry args={[0.3, WALL_HEIGHT, PLAZA_HALF * 2]} />
        <meshStandardMaterial color="#2c303d" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
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
