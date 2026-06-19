/* ============================================================
   BattlefieldScene — Redesigned with GREEN military theme
   ============================================================ */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Embers({ count = 500 }) {
  const meshRef = useRef();
  
  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 50;
      pos[i3 + 1] = Math.random() * 25 - 5;
      pos[i3 + 2] = (Math.random() - 0.5) * 50;
      
      vel[i3] = (Math.random() - 0.5) * 0.008;
      vel[i3 + 1] = Math.random() * 0.015 + 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.008;
      
      // Mix of green and orange embers
      const type = Math.random();
      if (type < 0.6) {
        // Green ember
        col[i3] = 0.0;
        col[i3 + 1] = 0.8 + Math.random() * 0.2;
        col[i3 + 2] = 0.1 + Math.random() * 0.15;
      } else {
        // Orange ember
        col[i3] = 1.0;
        col[i3 + 1] = 0.3 + Math.random() * 0.4;
        col[i3 + 2] = 0.0;
      }
      
      siz[i] = Math.random() * 3 + 1;
    }
    
    return [pos, vel, col, siz];
  }, [count]);
  
  useFrame(() => {
    if (!meshRef.current) return;
    const posArr = meshRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];
      
      if (posArr[i3 + 1] > 20) {
        posArr[i3] = (Math.random() - 0.5) * 50;
        posArr[i3 + 1] = -5;
        posArr[i3 + 2] = (Math.random() - 0.5) * 50;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.9}
        size={0.07}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function DistantExplosions() {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();
  const light4 = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) light1.current.intensity = (Math.sin(t * 0.7) * 0.5 + 0.5) * 2.5;
    if (light2.current) light2.current.intensity = (Math.sin(t * 1.3 + 2) * 0.5 + 0.5) * 2;
    if (light3.current) light3.current.intensity = (Math.sin(t * 0.5 + 4) * 0.5 + 0.5) * 1.5;
    if (light4.current) light4.current.intensity = (Math.sin(t * 0.9 + 1) * 0.5 + 0.5) * 1;
  });
  
  return (
    <>
      <pointLight ref={light1} position={[-15, 5, -20]} color="#ff4400" distance={50} />
      <pointLight ref={light2} position={[20, 3, -25]} color="#00ff41" distance={40} />
      <pointLight ref={light3} position={[0, 8, -30]} color="#ff6600" distance={60} />
      <pointLight ref={light4} position={[10, 2, -15]} color="#00cc33" distance={30} />
    </>
  );
}

function FogPlanes() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.x = Math.sin(state.clock.elapsedTime * 0.08 + i * 0.5) * 3;
        child.material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.03;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[0, i * 1.5 - 3, -12 - i * 4]}>
          <planeGeometry args={[70, 12]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#041504" : "#0a0a0a"}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function CameraController() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.12) * 0.8;
    state.camera.position.y = 2 + Math.sin(t * 0.18) * 0.4;
    state.camera.lookAt(0, 1, -10);
  });
  return null;
}

export default function BattlefieldScene() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
    }}>
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#020402' }}
      >
        <ambientLight intensity={0.03} color="#001a00" />
        <directionalLight position={[5, 10, -5]} intensity={0.2} color="#00aa33" />
        <fog attach="fog" args={['#020402', 5, 40]} />
        
        <CameraController />
        <Embers count={500} />
        <gridHelper args={[100, 100, '#0a3a0a', '#041504']} position={[0, -3, 0]} />
        <DistantExplosions />
        <FogPlanes />
      </Canvas>
    </div>
  );
}
