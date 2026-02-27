import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BlobMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.2, 8);
  }, []);

  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  function noise(x: number, y: number, z: number, t: number): number {
    const s1 = Math.sin(x * 2.1 + t * 0.8) * Math.cos(y * 1.7 + t * 0.5) * Math.sin(z * 1.5 + t * 0.35);
    const s2 = Math.sin(x * 3.2 + t * 1.3) * Math.cos(z * 2.8 + t * 0.9);
    const s3 = Math.cos(y * 4.0 + t * 0.6) * Math.sin(x * 3.5 + t * 1.1);
    const s4 = Math.sin(y * 1.4 + z * 1.6 + t * 0.45);
    const s5 = Math.cos(x * 2.5 + y * 2.0 + t * 0.7);
    return (s1 + s2 * 0.55 + s3 * 0.35 + s4 * 0.25 + s5 * 0.15) / 1.85;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta * 0.3;
    const t = timeRef.current;

    const positions = meshRef.current.geometry.attributes.position;
    const orig = originalPositions;

    for (let i = 0; i < positions.count; i++) {
      const ix = i * 3;
      const ox = orig[ix];
      const oy = orig[ix + 1];
      const oz = orig[ix + 2];

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len;
      const ny = oy / len;
      const nz = oz / len;

      const displacement = noise(nx, ny, nz, t) * 0.52;
      const r = len + displacement;

      positions.setXYZ(i, nx * r, ny * r, nz * r);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Continuous Y rotation + gentle wobble
    meshRef.current.rotation.y += delta * 0.45;
    meshRef.current.rotation.x = Math.sin(t * 0.35) * 0.15;
    meshRef.current.rotation.z = Math.cos(t * 0.28) * 0.07;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#ff6eb4"
        roughness={0.05}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.03}
        reflectivity={1.0}
        emissive="#ff2090"
        emissiveIntensity={0.12}
        iridescence={1.0}
        iridescenceIOR={2.2}
        iridescenceThicknessRange={[80, 1200]}
        envMapIntensity={1.5}
      />
    </mesh>
  );
}

export default function ContinuousRotatingBlob() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 46 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
    >
      <ambientLight intensity={0.3} color="#ffffff" />
      {/* Hot pink — main highlight */}
      <pointLight position={[5, 5, 5]} intensity={8} color="#ff3cac" />
      {/* Teal/cyan — cool contrast */}
      <pointLight position={[-6, 3, 3]} intensity={6} color="#00e5ff" />
      {/* Yellow/gold — warm accent */}
      <pointLight position={[3, -5, 4]} intensity={5} color="#ffe066" />
      {/* Orange — warm fill */}
      <pointLight position={[-4, -3, 5]} intensity={4} color="#ff6b35" />
      {/* Green teal — iridescent pop */}
      <pointLight position={[0, 6, -3]} intensity={3.5} color="#00ffb3" />
      {/* Soft white fill */}
      <pointLight position={[0, 0, 8]} intensity={2} color="#ffffff" />
      <BlobMesh />
    </Canvas>
  );
}
