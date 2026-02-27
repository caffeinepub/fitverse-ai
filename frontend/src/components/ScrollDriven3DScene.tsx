import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlobMeshProps {
  scrollProgress: number;
}

function BlobMesh({ scrollProgress }: BlobMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.8, 6);
  }, []);

  const originalPositions = useMemo(() => {
    return new Float32Array(geometry.attributes.position.array);
  }, [geometry]);

  // Simple noise function
  function noise(x: number, y: number, z: number, t: number): number {
    const s = Math.sin(x * 1.5 + t) * Math.cos(y * 1.3 + t * 0.7) * Math.sin(z * 1.1 + t * 0.5);
    const s2 = Math.sin(x * 2.3 + t * 1.3) * Math.cos(z * 2.1 + t * 0.9);
    const s3 = Math.cos(y * 3.1 + t * 0.6) * Math.sin(x * 2.7 + t * 1.1);
    return (s + s2 * 0.5 + s3 * 0.3) / 1.8;
  }

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    timeRef.current += delta * 0.4;
    const t = timeRef.current;

    const positions = meshRef.current.geometry.attributes.position;
    const orig = originalPositions;

    // Scroll-driven parameters
    const deformAmp = 0.25 + scrollProgress * 0.55;
    const scaleVal = 1.0 + scrollProgress * 0.5;

    for (let i = 0; i < positions.count; i++) {
      const ix = i * 3;
      const ox = orig[ix];
      const oy = orig[ix + 1];
      const oz = orig[ix + 2];

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len;
      const ny = oy / len;
      const nz = oz / len;

      const displacement = noise(nx, ny, nz, t) * deformAmp;
      const r = len + displacement;

      positions.setXYZ(i, nx * r, ny * r, nz * r);
    }

    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();

    // Slow rotation
    meshRef.current.rotation.y += delta * 0.12;
    meshRef.current.rotation.x += delta * 0.05;
    meshRef.current.scale.setScalar(scaleVal);
  });

  // Color interpolation based on scroll
  const color1 = new THREE.Color('#e040fb'); // magenta
  const color2 = new THREE.Color('#7c3aed'); // purple
  const color3 = new THREE.Color('#f06292'); // pink
  const blobColor = new THREE.Color();

  if (scrollProgress < 0.5) {
    blobColor.lerpColors(color1, color2, scrollProgress * 2);
  } else {
    blobColor.lerpColors(color2, color3, (scrollProgress - 0.5) * 2);
  }

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={blobColor}
        roughness={0.15}
        metalness={0.3}
        emissive={blobColor}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

function AmbientOrbs({ scrollProgress }: { scrollProgress: number }) {
  const orb1Ref = useRef<THREE.Mesh>(null);
  const orb2Ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orb1Ref.current) {
      orb1Ref.current.position.x = Math.sin(t * 0.3) * 3.5;
      orb1Ref.current.position.y = Math.cos(t * 0.2) * 2.5;
    }
    if (orb2Ref.current) {
      orb2Ref.current.position.x = Math.cos(t * 0.25) * -3.5;
      orb2Ref.current.position.y = Math.sin(t * 0.35) * 2.0;
    }
  });

  const orbOpacity = 0.08 + scrollProgress * 0.06;

  return (
    <>
      <mesh ref={orb1Ref} position={[3, 2, -3]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#e040fb" transparent opacity={orbOpacity} />
      </mesh>
      <mesh ref={orb2Ref} position={[-3, -2, -3]}>
        <sphereGeometry args={[1.0, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={orbOpacity} />
      </mesh>
    </>
  );
}

interface ScrollDriven3DSceneProps {
  scrollProgress: number;
}

export default function ScrollDriven3DScene({ scrollProgress }: ScrollDriven3DSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#e040fb" />
      <pointLight position={[-5, -3, 3]} intensity={1.8} color="#7c3aed" />
      <pointLight position={[0, 5, -3]} intensity={1.2} color="#f8bbd0" />
      <BlobMesh scrollProgress={scrollProgress} />
      <AmbientOrbs scrollProgress={scrollProgress} />
    </Canvas>
  );
}
