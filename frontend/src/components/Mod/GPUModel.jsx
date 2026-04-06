import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import modelUrl from "./nvidia_geforce_rtx_3090k1.glb?url";

function Model({ onHoverChange, onDragChange, hovered }) {
  const groupRef = useRef(null);
  const gltf = useGLTF(modelUrl);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) return;

    const t = clock.getElapsedTime();

    const idleRotation = t * 0.18;
    const floatY = Math.sin(t * 1.2) * 0.05;
    const pointerRotation = pointer.x * 0.35;

    const targetY = idleRotation + pointerRotation;
    const targetX = -0.1 + pointer.y * 0.2;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;

    groupRef.current.position.y += (floatY - groupRef.current.position.y) * 0.05;

    // ✨ subtle breathing scale
    const baseScale = 0.70;
    const pulse = Math.sin(t * 2) * 0.01;
    const hoverBoost = hovered ? 0.03 : 0;

    const finalScale = baseScale + pulse + hoverBoost;

    groupRef.current.scale.setScalar(
      groupRef.current.scale.x + (finalScale - groupRef.current.scale.x) * 0.08
    );
  });

  return (
    <Center>
      <group
        ref={groupRef}
        onPointerOver={() => onHoverChange(true)}
        onPointerOut={() => {
          onHoverChange(false);
          onDragChange(false);
        }}
        onPointerDown={() => onDragChange(true)}
        onPointerUp={() => onDragChange(false)}
        onPointerMissed={() => onDragChange(false)}
      >
        <primitive object={scene} />
      </group>
    </Center>
  );
}

useGLTF.preload(modelUrl);

function Loader() {
  return (
    <Html center>
      <div className="rounded-lg border border-cyan-400/40 bg-slate-900/80 px-4 py-2 text-xs text-cyan-200 backdrop-blur-md shadow-lg shadow-cyan-500/10 animate-pulse">
        Powering GPU Core...
      </div>
    </Html>
  );
}

/* 🔥 Edge glow system */
function GlowLight({ hovered }) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    const pulse = Math.sin(t * 2.5) * 0.08;
    const base = hovered ? 1.2 : 0.9;

    if (lightRef.current) {
      lightRef.current.intensity = base + pulse;
    }
  });

  return (
    <>
      {/* main rim light (edge highlight) */}
      <pointLight
        ref={lightRef}
        position={[0, 1.2, -2.5]}
        color="#00eaff"
        intensity={1}
      />

      {/* side edge fill */}
      <pointLight position={[2.5, 0.5, -1.5]} intensity={0.6} color="#00f0ff" />
      <pointLight position={[-2.5, 0.5, -1.5]} intensity={0.6} color="#00f0ff" />
    </>
  );
}

export default function GPUModel() {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const cursor = dragging ? "grabbing" : hovered ? "pointer" : "default";

  return (
    <Canvas
      camera={{ position: [0, 0.2, 4.1], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={{ cursor }}
    >
      {/* darker base → stronger glow contrast */}
      <ambientLight intensity={0.4} />

      <directionalLight position={[3, 4, 2]} intensity={1.25} color="#e6f6ff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#1a2aff" />

      <pointLight position={[-2, 1, -2]} intensity={0.55} color="#7c5cff" />
      <pointLight position={[2, 1, 2]} intensity={0.55} color="#18e6f5" />

      {/* 🔥 edge glow */}
      <GlowLight hovered={hovered} />

      <Suspense fallback={<Loader />}>
        <Model
          onHoverChange={setHovered}
          onDragChange={setDragging}
          hovered={hovered}
        />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.09}
        rotateSpeed={0.8}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={1.1}
        maxPolarAngle={2.0}
      />
    </Canvas>
  );
}