import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

const TorusKnotMesh = () => {
  const meshRef = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 1.2;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[10, 3, 100, 16]} />
      <meshStandardMaterial
        color="#00ff87"
        emissive="#00ff87"
        emissiveIntensity={0.8}
        wireframe={true}
      />
    </mesh>
  );
};

export const Canvas3D = () => {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ background: 'transparent' }}
      camera={{ position: [0, 0, 30], fov: 75 }}
    >
      <ambientLight intensity={0.65} />
      <pointLight position={[12, 10, 10]} intensity={1.4} color="#00ff87" />
      <TorusKnotMesh />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
      />
    </Canvas>
  );
};
