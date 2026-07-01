"use client";

import { useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/**
 * The 3D showpiece: the celebrant rendered as a gleaming figure on a spotlit
 * gold plinth. Client-only (loaded via `next/dynamic` with `ssr:false` from
 * CelebrantHero) so three.js never runs during SSR.
 *
 * The GLB is a Meshy export whose colour map is baked into the material's
 * emissive channel too, which makes it read as flat/self-lit. We dial the
 * emissive back so our warm key + rose rim lights actually shape the form,
 * and lean on a procedural (no-network) environment for PBR reflections.
 */
const MODEL_URL =
  "/Meshy_AI_Executive_Leadership__0701085712_texture.glb";

// The model stands ~0.08 units tall with its feet at y=0. Scale it up so it
// reads as a life-size statue on the plinth, feet still resting on y=0.
const MODEL_SCALE = 21;

useGLTF.preload(MODEL_URL);

function CelebrantModel({ onReady }: { onReady?: () => void }) {
  const { scene } = useGLTF(MODEL_URL);

  useMemo(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      const mat = obj.material as THREE.MeshStandardMaterial;
      if (!mat) return;
      // Keep a floor of self-illumination so the textured figure is always
      // visible, but let the lights + environment do the real shaping.
      if ("emissiveIntensity" in mat) mat.emissiveIntensity = 0.5;
      mat.envMapIntensity = 1.1;
      mat.needsUpdate = true;
    });
  }, [scene]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return <primitive object={scene} scale={MODEL_SCALE} position={[0, 0, 0]} />;
}

/** A dark metal plinth ringed in gold for the figure to stand on. */
function Plinth() {
  return (
    <group>
      {/* the drum of the plinth; its top face sits at y=0 (the figure's feet) */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.92, 1.02, 0.18, 72]} />
        <meshStandardMaterial color="#1b1930" metalness={0.65} roughness={0.35} />
      </mesh>
      {/* a polished top inlay */}
      <mesh position={[0, -0.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.9, 72]} />
        <meshStandardMaterial
          color="#241f38"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* gold rim catching the key light */}
      <mesh position={[0, 0.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.018, 20, 96]} />
        <meshStandardMaterial
          color="#edd695"
          metalness={1}
          roughness={0.22}
          emissive="#b58a3c"
          emissiveIntensity={0.35}
        />
      </mesh>
    </group>
  );
}

export default function CelebrantStage({ onReady }: { onReady?: () => void }) {
  const reduce = !!useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 0.95, 3.5], fov: 34 }}
      style={{ background: "transparent" }}
    >
      {/* base fill so the figure is never a black silhouette */}
      <ambientLight intensity={0.5} />
      {/* warm gold key from upper right */}
      <spotLight
        position={[3.5, 5, 3]}
        angle={0.5}
        penumbra={1}
        decay={0}
        intensity={2.4}
        color="#f6e0a8"
      />
      {/* rose rim from behind-left to separate the figure from the dark */}
      <spotLight
        position={[-4, 2.5, -2.5]}
        angle={0.6}
        penumbra={1}
        decay={0}
        intensity={1.6}
        color="#e0739a"
      />
      {/* soft frontal fill */}
      <directionalLight position={[0, 1.2, 4]} intensity={0.5} color="#fff3d6" />

      <Float
        speed={reduce ? 0 : 1.3}
        rotationIntensity={0}
        floatIntensity={reduce ? 0 : 0.6}
        floatingRange={[0, 0.06]}
      >
        <CelebrantModel onReady={onReady} />
      </Float>

      <Plinth />

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.6}
        scale={5}
        blur={2.6}
        far={3}
        color="#000000"
      />

      {/* procedural studio lighting for reflections — generated on the GPU,
          so there's no HDR file fetched over the network. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2}
          color="#f6e3ad"
          position={[0, 3, 2]}
          scale={[7, 2, 1]}
        />
        <Lightformer
          intensity={1.3}
          color="#e0739a"
          position={[-3, 1.5, -2]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#8a7bd8"
          position={[3, 1, -1.5]}
          scale={[3, 3, 1]}
        />
      </Environment>

      <OrbitControls
        makeDefault
        target={[0, 0.85, 0]}
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduce}
        autoRotateSpeed={0.85}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.6}
      />

      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
