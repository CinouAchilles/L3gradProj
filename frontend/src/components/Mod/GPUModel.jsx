import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html, OrbitControls, useGLTF } from "@react-three/drei";
import modelUrl from "./nvidia_geforce_rtx_3090k1.glb?url";

function Model({ onHoverChange, onDragChange }) {
  const groupRef = useRef(null);
  const gltf = useGLTF(modelUrl);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  useFrame(({ clock, pointer }) => {
    if (!groupRef.current) {
      return;
    }

    const t = clock.getElapsedTime();
    const idleRotation = t * 0.18;
    const pointerRotation = pointer.x * 0.35;
    const targetY = idleRotation + pointerRotation;
    const targetX = -0.1 + pointer.y * 0.2;

    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.04;
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
        <primitive object={scene} scale={0.76} />
      </group>
    </Center>
  );
}

useGLTF.preload(modelUrl);

function Loader() {
  return (
    <Html center>
      <div className="rounded-lg border border-cyan-400/30 bg-slate-900/70 px-3 py-1 text-xs text-cyan-200 backdrop-blur-sm">
        Loading GPU...
      </div>
    </Html>
  );
}

export default function GPUModel() {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  const cursor = dragging ? "grabbing" : hovered ? "pointer" : "default";

  return (
    <Canvas
      camera={{ position: [0, 0.15, 4.2], fov: 44 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      style={{ cursor }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={1.15} color="#d4edff" />
      <pointLight position={[-2, 1, -2]} intensity={0.45} color="#7c5cff" />
      <pointLight position={[2, 1, 2]} intensity={0.45} color="#18e6f5" />

      <Suspense fallback={<Loader />}>
        <Model onHoverChange={setHovered} onDragChange={setDragging} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.09}
        rotateSpeed={0.75}
        autoRotate
        autoRotateSpeed={0.45}
        minPolarAngle={1.1}
        maxPolarAngle={2.0}
      />
    </Canvas>
  );
}