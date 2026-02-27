import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlobMeshProps {
  scrollProgress: number;
}

function BlobMesh({ scrollProgress }: BlobMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  // Smooth interpolated values stored in refs for lerping
  const currentY = useRef(0);
  const currentRotX = useRef(0);
  const currentRotZ = useRef(0);
  const currentSpiralSpeed = useRef(0);
  const currentMorphBlend = useRef(0);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(2.0, 8);
  }, []);

  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  // Organic noise function for blob shape A (smooth, round)
  function noiseA(x: number, y: number, z: number, t: number): number {
    const s1 = Math.sin(x * 1.8 + t * 0.7) * Math.cos(y * 1.5 + t * 0.5) * Math.sin(z * 1.3 + t * 0.4);
    const s2 = Math.sin(x * 2.5 + t * 1.1) * Math.cos(z * 2.1 + t * 0.8);
    const s3 = Math.cos(y * 3.2 + t * 0.6) * Math.sin(x * 2.9 + t * 1.0);
    const s4 = Math.sin(y * 1.1 + z * 1.3 + t * 0.45);
    return (s1 + s2 * 0.5 + s3 * 0.3 + s4 * 0.2) / 2.0;
  }

  // Noise function for blob shape B (spikier, more angular)
  function noiseB(x: number, y: number, z: number, t: number): number {
    const s1 = Math.sin(x * 3.5 + t * 0.9) * Math.cos(y * 3.2 + t * 0.7);
    const s2 = Math.sin(z * 4.1 + t * 1.2) * Math.cos(x * 3.8 + t * 0.5);
    const s3 = Math.cos(y * 5.0 + t * 0.8) * Math.sin(z * 4.5 + t * 1.1);
    return (s1 + s2 * 0.6 + s3 * 0.4) / 2.0;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta * 0.3;
    const t = timeRef.current;

    // Lerp factor for smooth transitions
    const lerpFactor = 1 - Math.pow(0.01, delta);

    // Target values based on scroll
    const targetY = scrollProgress * 4.5; // move up
    const targetMorphBlend = scrollProgress;
    const targetSpiralSpeed = scrollProgress * 6.0; // spiral intensity

    // Smooth interpolation
    currentY.current += (targetY - currentY.current) * lerpFactor;
    currentMorphBlend.current += (targetMorphBlend - currentMorphBlend.current) * lerpFactor;
    currentSpiralSpeed.current += (targetSpiralSpeed - currentSpiralSpeed.current) * lerpFactor;

    // Floating bob (idle)
    const floatY = Math.sin(t * 0.8) * 0.18;

    // Position: float + scroll-driven upward movement
    meshRef.current.position.y = floatY - currentY.current;

    // Continuous Y rotation (always on)
    meshRef.current.rotation.y += delta * 0.45;

    // Spiral twist: X and Z rotation increase with scroll
    const spiralAngle = currentSpiralSpeed.current * t * 0.15;
    meshRef.current.rotation.x = Math.sin(spiralAngle) * currentSpiralSpeed.current * 0.12 + Math.sin(t * 0.35) * 0.12;
    meshRef.current.rotation.z = Math.cos(spiralAngle * 0.7) * currentSpiralSpeed.current * 0.08 + Math.cos(t * 0.28) * 0.06;

    // Morph geometry between shape A and shape B
    const positions = meshRef.current.geometry.attributes.position;
    const orig = originalPositions;
    const blend = currentMorphBlend.current;

    for (let i = 0; i < positions.count; i++) {
      const ix = i * 3;
      const ox = orig[ix];
      const oy = orig[ix + 1];
      const oz = orig[ix + 2];

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len;
      const ny = oy / len;
      const nz = oz / len;

      const dispA = noiseA(nx, ny, nz, t) * 0.42;
      const dispB = noiseB(nx, ny, nz, t) * 0.65;
      const displacement = dispA * (1 - blend) + dispB * blend;
      const r = len + displacement;

      positions.setXYZ(i, nx * r, ny * r, nz * r);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#ff6eb4"
        roughness={0.0}
        metalness={0.05}
        clearcoat={1.0}
        clearcoatRoughness={0.02}
        reflectivity={1.0}
        emissive="#c020e0"
        emissiveIntensity={0.22}
        iridescence={1.0}
        iridescenceIOR={2.0}
        iridescenceThicknessRange={[80, 900]}
        transmission={0.05}
        thickness={0.5}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);
  const orb3Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.25) * 5.0;
      orb1Ref.current.position.y = Math.cos(t * 0.20) * 3.2;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.18) * -4.5;
      orb2Ref.current.position.y = Math.sin(t * 0.30) * 2.8;
    }
    if (orb3Ref.current) {
      orb3Ref.current.position.x = Math.sin(t * 0.32 + 2) * 4.0;
      orb3Ref.current.position.y = Math.cos(t * 0.16 + 1) * -3.0;
    }
  });

  return (
    <>
      <mesh ref={orb1Ref} position={[4, 2, -5]}>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial color="#ff4fc8" transparent opacity={0.10} />
      </mesh>
      <mesh ref={orb2Ref} position={[-4, -2, -5]}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.09} />
      </mesh>
      <mesh ref={orb3Ref} position={[3, -3, -4]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#ff9a3c" transparent opacity={0.08} />
      </mesh>
    </>
  );
}

interface Web3BlobProps {
  scrollProgress?: number;
}

export default function Web3Blob({ scrollProgress = 0 }: Web3BlobProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 46 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[7, 7, 7]} intensity={4.0} color="#ff80d5" />
      <pointLight position={[-7, -5, 5]} intensity={3.0} color="#7c3aed" />
      <pointLight position={[0, 7, -5]} intensity={2.5} color="#06ffa5" />
      <pointLight position={[5, -5, 3]} intensity={2.2} color="#ff9a3c" />
      <pointLight position={[-4, 4, 2]} intensity={1.8} color="#4fc3f7" />
      <BlobMesh scrollProgress={scrollProgress} />
      <FloatingOrbs />
    </Canvas>
  );
}
