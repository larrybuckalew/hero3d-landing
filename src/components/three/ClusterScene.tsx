"use client";

import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  Preload,
} from "@react-three/drei";
import { Canvas, invalidate, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * Composition data — hand-tuned so the cluster reads well on load.
 * speed = orbital rad/s, tilt = orbit-plane tilt, bob = vertical drift
 * ------------------------------------------------------------------ */

type MatKey = "plasma" | "volt" | "ion" | "frost";
type GeoKey = "ico" | "octa" | "tetra" | "torus" | "cube";

type Shard = {
  geo: GeoKey;
  mat: MatKey;
  radius: number;
  tilt: number;
  angle: number;
  speed: number;
  size: number;
  bob: number;
  bobSpeed: number;
  floatSpeed: number;
};

const SHARDS: Shard[] = [
  { geo: "ico", mat: "plasma", radius: 2.5, tilt: 0.18, angle: 0.4, speed: 0.24, size: 1.05, bob: 0.22, bobSpeed: 0.9, floatSpeed: 1.3 },
  { geo: "octa", mat: "volt", radius: 3.15, tilt: -0.32, angle: 2.1, speed: -0.18, size: 0.85, bob: 0.3, bobSpeed: 0.7, floatSpeed: 1.7 },
  { geo: "torus", mat: "ion", radius: 2.05, tilt: 0.52, angle: 4.0, speed: 0.3, size: 0.95, bob: 0.18, bobSpeed: 1.1, floatSpeed: 2.0 },
  { geo: "tetra", mat: "frost", radius: 3.6, tilt: 0.1, angle: 1.1, speed: 0.13, size: 1.2, bob: 0.34, bobSpeed: 0.55, floatSpeed: 1.1 },
  { geo: "cube", mat: "plasma", radius: 2.85, tilt: -0.62, angle: 5.2, speed: -0.22, size: 0.7, bob: 0.26, bobSpeed: 0.95, floatSpeed: 1.5 },
  { geo: "ico", mat: "ion", radius: 4.05, tilt: 0.42, angle: 3.2, speed: 0.1, size: 0.62, bob: 0.4, bobSpeed: 0.45, floatSpeed: 0.9 },
  { geo: "octa", mat: "frost", radius: 1.75, tilt: -0.15, angle: 0.9, speed: -0.34, size: 0.55, bob: 0.16, bobSpeed: 1.3, floatSpeed: 2.3 },
  { geo: "tetra", mat: "volt", radius: 3.35, tilt: 0.7, angle: 2.7, speed: 0.16, size: 0.72, bob: 0.3, bobSpeed: 0.6, floatSpeed: 1.4 },
  { geo: "torus", mat: "plasma", radius: 4.35, tilt: -0.45, angle: 5.9, speed: -0.09, size: 0.8, bob: 0.36, bobSpeed: 0.5, floatSpeed: 1.0 },
  { geo: "cube", mat: "ion", radius: 2.35, tilt: 0.36, angle: 1.9, speed: 0.27, size: 0.5, bob: 0.2, bobSpeed: 1.15, floatSpeed: 1.9 },
  { geo: "octa", mat: "plasma", radius: 4.7, tilt: 0.24, angle: 4.6, speed: 0.07, size: 0.55, bob: 0.42, bobSpeed: 0.4, floatSpeed: 0.8 },
  { geo: "ico", mat: "volt", radius: 1.95, tilt: -0.7, angle: 3.8, speed: -0.29, size: 0.46, bob: 0.14, bobSpeed: 1.4, floatSpeed: 2.1 },
];

/* ------------------------------------------------------------------ *
 * Shared GPU assets — created once, disposed on unmount
 * ------------------------------------------------------------------ */

function useAssets() {
  const assets = useMemo(() => {
    const geo: Record<GeoKey, THREE.BufferGeometry> = {
      ico: new THREE.IcosahedronGeometry(0.42, 0),
      octa: new THREE.OctahedronGeometry(0.42, 0),
      tetra: new THREE.TetrahedronGeometry(0.5, 0),
      torus: new THREE.TorusGeometry(0.32, 0.11, 16, 48),
      cube: new THREE.BoxGeometry(0.5, 0.5, 0.5),
    };

    const metal = (
      color: string,
      extra: THREE.MeshPhysicalMaterialParameters = {},
    ) =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        metalness: 0.86,
        roughness: 0.17,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.35,
        ...extra,
      });

    const mats: Record<MatKey, THREE.Material> = {
      plasma: metal("#7c5cff", {
        roughness: 0.12,
        sheen: 0.6,
        sheenColor: new THREE.Color("#c4b5fd"),
      }),
      volt: metal("#c4f24a", {
        metalness: 0.62,
        roughness: 0.26,
        emissive: new THREE.Color("#3d5306"),
        emissiveIntensity: 0.4,
      }),
      ion: metal("#22d3ee", {
        metalness: 0.5,
        roughness: 0.1,
        iridescence: 1,
        iridescenceIOR: 1.6,
      }),
      frost: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#dbe4ff"),
        metalness: 0.1,
        roughness: 0.06,
        transmission: 0.9,
        thickness: 0.9,
        ior: 1.45,
        clearcoat: 1,
        envMapIntensity: 1.5,
        transparent: true,
        opacity: 0.92,
      }),
    };

    return {
      geo,
      mats,
      knot: new THREE.TorusKnotGeometry(1.12, 0.32, 220, 36, 2, 3),
      shell: new THREE.IcosahedronGeometry(2.05, 1),
      orbitRing: new THREE.TorusGeometry(2.75, 0.012, 8, 200),
    };
  }, []);

  useEffect(
    () => () => {
      Object.values(assets.geo).forEach((g) => g.dispose());
      Object.values(assets.mats).forEach((m) => m.dispose());
      assets.knot.dispose();
      assets.shell.dispose();
      assets.orbitRing.dispose();
    },
    [assets],
  );

  return assets;
}

type Assets = ReturnType<typeof useAssets>;

/* ------------------------------------------------------------------ *
 * Pointer source: a window listener, so the canvas can stay
 * pointer-events:none (hero text stays selectable, page still scrolls)
 * ------------------------------------------------------------------ */

function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return pointer;
}

/* ------------------------------------------------------------------ *
 * Motion preference (drei has no reduced-motion hook in v10)
 * ------------------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ *
 * Animated pieces
 * ------------------------------------------------------------------ */

function Core({ assets, animate }: { assets: Assets; animate: boolean }) {
  const knot = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    const dt = Math.min(delta, 1 / 20);
    if (knot.current) {
      knot.current.rotation.y += dt * 0.34;
      knot.current.rotation.x += dt * 0.12;
    }
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.14;
      shell.current.rotation.z += dt * 0.05;
    }
  });

  return (
    <group>
      <Float
        speed={animate ? 1.25 : 0}
        rotationIntensity={animate ? 0.3 : 0}
        floatIntensity={animate ? 0.5 : 0}
      >
        <mesh ref={knot} geometry={assets.knot} material={assets.mats.plasma} />
        <mesh ref={shell} geometry={assets.shell} scale={1.04}>
          <meshBasicMaterial color="#8ea2ff" wireframe transparent opacity={0.13} />
        </mesh>
      </Float>

      {/* orbit guide rings */}
      <mesh geometry={assets.orbitRing} rotation={[Math.PI / 2.1, 0.2, 0]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} />
      </mesh>
      <mesh geometry={assets.orbitRing} rotation={[1.15, -0.5, 0.4]} scale={1.34}>
        <meshBasicMaterial color="#c4f24a" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function ShardBelt({
  assets,
  shards,
  animate,
}: {
  assets: Assets;
  shards: Shard[];
  animate: boolean;
}) {
  const rotators = useRef<(THREE.Group | null)[]>([]);

  // One useFrame loop for the whole belt — no per-mesh React work.
  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < rotators.current.length; i += 1) {
      const g = rotators.current[i];
      const s = shards[i];
      if (!g || !s) continue;
      g.rotation.y = s.angle + t * s.speed;
      g.position.y = Math.sin(t * s.bobSpeed + s.angle) * s.bob;
    }
  });

  return (
    <>
      {shards.map((s, i) => (
        <group
          key={`${s.geo}-${s.mat}-${i}`}
          rotation={[s.tilt, s.angle, s.tilt * 0.35]}
          ref={(node) => {
            rotators.current[i] = node;
          }}
        >
          <Float
            speed={animate ? s.floatSpeed : 0}
            rotationIntensity={animate ? 0.9 : 0}
            floatIntensity={animate ? 0.7 : 0}
            floatingRange={[-0.12, 0.12]}
          >
            <mesh
              geometry={assets.geo[s.geo]}
              material={assets.mats[s.mat]}
              position={[s.radius, 0, 0]}
              scale={s.size}
              rotation={[s.angle, s.angle * 0.5, 0]}
            />
          </Float>
        </group>
      ))}
    </>
  );
}

/** Whole-cluster rig: cursor parallax + scroll-linked drift. */
function Rig({ children, animate }: { children: React.ReactNode; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    const vh = typeof window !== "undefined" ? window.innerHeight : 1;
    const progress =
      typeof document !== "undefined"
        ? Math.min(document.documentElement.scrollTop / Math.max(vh, 1), 1.6)
        : 0;

    const px = animate ? pointer.current.x : 0;
    const py = animate ? pointer.current.y : 0;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.42, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.26 + progress * 0.16, 3, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, -progress * 1.4, 3.4, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, progress * 2.1, 3.4, dt);

    const targetScale = 1 - Math.min(progress, 1) * 0.16;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, targetScale, 3.4, dt));
  });

  return <group ref={group}>{children}</group>;
}

/** Slow camera sway so the frame never feels frozen. */
function CameraSway({ animate }: { animate: boolean }) {
  useFrame((state) => {
    if (!animate) return;
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.16) * 0.5;
    state.camera.position.y = 0.55 + Math.cos(t * 0.21) * 0.25;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ *
 * Scene assembly
 * ------------------------------------------------------------------ */

function SceneContents({ isMobile }: { isMobile: boolean }) {
  const assets = useAssets();
  const reduceMotion = usePrefersReducedMotion();
  const animate = reduceMotion !== true;
  const shards = isMobile ? SHARDS.slice(0, 8) : SHARDS;

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 4]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-6, 2, -4]} intensity={38} decay={2} color="#7c5cff" />
      <pointLight position={[4.5, -3, 3]} intensity={26} decay={2} color="#c4f24a" />

      <Rig animate={animate}>
        <Core assets={assets} animate={animate} />
        <ShardBelt assets={assets} shards={shards} animate={animate} />
      </Rig>

      <CameraSway animate={animate} />

      <ContactShadows
        position={[0, -3.1, 0]}
        scale={16}
        opacity={0.5}
        blur={2.8}
        far={5}
        resolution={isMobile ? 256 : 512}
        color="#02030a"
        frames={animate ? Infinity : 1}
      />

      {/* Procedural studio env — reflections without fetching an HDRI. */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={["#05060f"]} />
        <Lightformer intensity={3.4} position={[0, 5, -6]} scale={[12, 5, 1]} color="#a78bfa" />
        <Lightformer intensity={2.6} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#22d3ee" />
        <Lightformer intensity={2.2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} color="#c4f24a" />
        <Lightformer form="ring" intensity={4} position={[0, -4, 0]} scale={6} color="#f472b6" />
      </Environment>

      <Preload all />
    </>
  );
}

export default function ClusterScene({
  isMobile = false,
  paused = false,
}: {
  isMobile?: boolean;
  paused?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const animate = !reduceMotion;
  const frameloop = animate ? (paused ? "never" : "always") : "demand";

  // Kick the loop when we flip back on (or when the scene first mounts).
  useEffect(() => {
    if (frameloop !== "never") invalidate();
  }, [frameloop]);

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 2]}
      frameloop={frameloop}
      camera={{ position: [0, 0.55, 9.4], fov: 38 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08;
      }}
    >
      <SceneContents isMobile={isMobile} />
    </Canvas>
  );
}




