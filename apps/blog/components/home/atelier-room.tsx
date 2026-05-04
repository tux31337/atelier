"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM_ROUTES } from "./room-routes";

const PLAYER_SPEED = 4;
const CAMERA_DISTANCE = 3.5;
const CAMERA_BASE_HEIGHT = 1.4;
const LOOK_AT_HEIGHT = 1.0;
const PITCH_MIN = -0.3;
const PITCH_MAX = 0.9;
const ROOM = { minX: -5, maxX: 5, minZ: -4.4, maxZ: 3.1, ceiling: 3.7 };
const PLAYER_BOUNDS = {
  minX: ROOM.minX + 0.4,
  maxX: ROOM.maxX - 0.4,
  minZ: ROOM.minZ + 0.4,
  maxZ: ROOM.maxZ - 0.4,
};
const BOUNDS = PLAYER_BOUNDS;

export function AtelierRoom() {
  return (
    <section
      className="relative min-h-0 flex-1 overflow-hidden bg-[#090806]"
      aria-labelledby="atelier-room-title"
    >
      <div className="absolute inset-0">
        <Suspense fallback={<RoomLoading />}>
          <Canvas
            camera={{ position: [0, 4, 7], fov: 60 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={["#0b0a08"]} />
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <div className="pointer-events-none absolute left-6 top-5 z-10 max-w-sm rounded-md border border-stone-600/60 bg-[#11100f]/82 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
        <p className="font-code-label text-code-label text-amber-200">Atelier Room</p>
        <h1 id="atelier-room-title" className="mt-2 font-headline-lg text-2xl text-stone-50">
          3D 방 프로토타입
        </h1>
        <p className="mt-2 font-body-md text-sm text-stone-300">
          WASD 이동 / 마우스 드래그로 시점 회전
        </p>
      </div>
    </section>
  );
}

function RoomLoading() {
  return (
    <div className="grid h-full place-items-center bg-[#090806] font-code-label text-code-label text-amber-200">
      3D 방을 준비하는 중
    </div>
  );
}

function Scene() {
  return (
    <group>
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 10, 7]} intensity={2.4} />
      <directionalLight position={[-6, 8, -4]} intensity={1.0} color="#ffd9a3" />
      <Floor />
      <Walls />
      {ROOM_ROUTES.map((route) => (
        <RouteMarker key={route.id} position={route.position} accent={route.accent} />
      ))}
      <Player />
    </group>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.4]}>
      <planeGeometry args={[10, 9]} />
      <meshStandardMaterial color="#5a4030" roughness={0.9} />
    </mesh>
  );
}

function Walls() {
  return (
    <group>
      <mesh position={[0, 1.8, -4.4]}>
        <boxGeometry args={[10, 3.6, 0.14]} />
        <meshStandardMaterial color="#3d4f6a" roughness={0.85} />
      </mesh>
      <mesh position={[-5, 1.8, -1.4]}>
        <boxGeometry args={[0.14, 3.6, 6.4]} />
        <meshStandardMaterial color="#43332a" roughness={0.85} />
      </mesh>
      <mesh position={[5, 1.8, -1.4]}>
        <boxGeometry args={[0.14, 3.6, 6.4]} />
        <meshStandardMaterial color="#43332a" roughness={0.85} />
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
    <mesh position={[x, height / 2, z]}>
      <boxGeometry args={[0.9, height, 0.9]} />
      <meshStandardMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={0.6}
        roughness={0.4}
      />
    </mesh>
  );
}

function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const positionRef = useRef(new THREE.Vector3(0, 0, 0));
  const yawRef = useRef(0);
  const pitchRef = useRef(0.3);
  const keysRef = useRef<Record<string, boolean>>({});
  const draggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const { camera, gl } = useThree();

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
      positionRef.current.x = clamp(positionRef.current.x + dx, BOUNDS.minX, BOUNDS.maxX);
      positionRef.current.z = clamp(positionRef.current.z + dz, BOUNDS.minZ, BOUNDS.maxZ);
    }

    if (groupRef.current) {
      groupRef.current.position.copy(positionRef.current);
      groupRef.current.rotation.y = yawRef.current;
    }

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const cosP = Math.cos(pitch);
    camera.position.set(
      positionRef.current.x + Math.sin(yaw) * cosP * CAMERA_DISTANCE,
      positionRef.current.y + Math.sin(pitch) * CAMERA_DISTANCE + CAMERA_BASE_HEIGHT,
      positionRef.current.z + Math.cos(yaw) * cosP * CAMERA_DISTANCE,
    );
    camera.lookAt(
      positionRef.current.x,
      positionRef.current.y + LOOK_AT_HEIGHT,
      positionRef.current.z,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.85, 0]}>
        <capsuleGeometry args={[0.32, 0.9, 8, 16]} />
        <meshStandardMaterial color="#d6d3d1" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#a8a29e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.65, -0.27]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1c1917" />
      </mesh>
    </group>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
