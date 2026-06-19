/* ============================================================
   BattlefieldScene — 3D Command Bunker Walkthrough Mode
   ============================================================ */
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const TERMINALS = [
  { id: 'campaign', label: 'CAMPAIGN DOSSIER', x: -3.5, z: -3 },
  { id: 'multiplayer', label: 'MULTIPLAYER LOBBY', x: -2, z: -9 },
  { id: 'armory', label: 'ARMORY WORKBENCH', x: 2, z: -15 },
  { id: 'barracks', label: 'BARRACKS RECORDS', x: 3.5, z: -21 },
  { id: 'comms', label: 'COMMS TRANSCEIVER', x: 0, z: -27 }
];

function Embers({ count = 400 }) {
  const meshRef = useRef();
  
  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 50;
      pos[i3 + 1] = Math.random() * 20 - 4;
      pos[i3 + 2] = (Math.random() - 0.5) * 60;
      
      vel[i3] = (Math.random() - 0.5) * 0.008;
      vel[i3 + 1] = Math.random() * 0.012 + 0.003;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.008;
      
      const type = Math.random();
      if (type < 0.6) {
        col[i3] = 0.0;
        col[i3 + 1] = 0.8 + Math.random() * 0.2;
        col[i3 + 2] = 0.1 + Math.random() * 0.15;
      } else {
        col[i3] = 1.0;
        col[i3 + 1] = 0.3 + Math.random() * 0.3;
        col[i3 + 2] = 0.0;
      }
      
      siz[i] = Math.random() * 2.5 + 1;
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
      
      if (posArr[i3 + 1] > 18) {
        posArr[i3] = (Math.random() - 0.5) * 50;
        posArr[i3 + 1] = -4;
        posArr[i3 + 2] = (Math.random() - 0.5) * 60;
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
        opacity={0.8}
        size={0.06}
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
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) light1.current.intensity = (Math.sin(t * 0.7) * 0.5 + 0.5) * 2;
    if (light2.current) light2.current.intensity = (Math.sin(t * 1.2 + 2) * 0.5 + 0.5) * 1.5;
    if (light3.current) light3.current.intensity = (Math.sin(t * 0.4 + 4) * 0.5 + 0.5) * 1.2;
  });
  
  return (
    <>
      <pointLight ref={light1} position={[-20, 5, -20]} color="#ff4400" distance={60} />
      <pointLight ref={light2} position={[20, 3, -30]} color="#00ff41" distance={50} />
      <pointLight ref={light3} position={[0, 8, -40]} color="#ff6600" distance={70} />
    </>
  );
}

function HoloTerminal({ position, label, isNear }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.015;
      meshRef.current.rotation.x += 0.008;
    }
  });

  return (
    <group position={position}>
      {/* Glowing floating hologram */}
      <mesh ref={meshRef} position={[0, 0.4, 0]}>
        <dodecahedronGeometry args={[0.25]} />
        <meshStandardMaterial
          color={isNear ? "#ff6a00" : "#00ff41"}
          emissive={isNear ? "#ff6a00" : "#00ff41"}
          emissiveIntensity={1.2}
          wireframe
        />
      </mesh>
      
      {/* Cyber projection beam */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.3, 0.6, 8, 1, true]} />
        <meshBasicMaterial
          color={isNear ? "#ff6a00" : "#00ff41"}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* HTML label badge */}
      <Html position={[0, 1.1, 0]} center distanceFactor={15}>
        <div 
          className="terminal-3d-label" 
          style={{
            borderColor: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            color: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            boxShadow: isNear ? '0 0 15px rgba(255,106,0,0.3)' : '0 0 10px rgba(0,255,65,0.2)'
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function CameraController({ is3DMode, virtualDir, onNearTerminal, onUpdateWalking }) {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const playerZ = useRef(5);
  const playerX = useRef(0);

  // Set keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!is3DMode) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.w = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.s = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = true;
    };

    const handleKeyUp = (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.w = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.s = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [is3DMode]);

  useFrame((state, delta) => {
    if (!is3DMode) {
      // Cinematic menu camera sway
      const t = state.clock.elapsedTime;
      state.camera.position.x = Math.sin(t * 0.1) * 0.6;
      state.camera.position.y = 2 + Math.sin(t * 0.15) * 0.3;
      state.camera.position.z = 5;
      state.camera.lookAt(0, 1.2, -10);
      return;
    }

    // --- Movement calculations ---
    const moveSpeed = 6 * delta;
    let dx = 0;
    let dz = 0;

    if (keys.current.w || virtualDir === 'UP') dz -= moveSpeed;
    if (keys.current.s || virtualDir === 'DOWN') dz += moveSpeed;
    if (keys.current.a || virtualDir === 'LEFT') dx -= moveSpeed;
    if (keys.current.d || virtualDir === 'RIGHT') dx += moveSpeed;

    // Check if moving
    const isWalking = dx !== 0 || dz !== 0;
    if (onUpdateWalking) {
      onUpdateWalking(isWalking);
    }

    // Update coordinates with constraints (bunker size boundaries)
    playerX.current = Math.max(-8, Math.min(8, playerX.current + dx));
    playerZ.current = Math.max(-32, Math.min(8, playerZ.current + dz));

    // Bobbing height when walking
    const bob = isWalking ? Math.sin(state.clock.elapsedTime * 12) * 0.05 : 0;

    // Set camera position
    state.camera.position.x = playerX.current;
    state.camera.position.y = 1.6 + bob; // fixed eye level + walk bob
    state.camera.position.z = playerZ.current;

    // Look forward down the hallway corridor
    state.camera.lookAt(playerX.current, 1.6, playerZ.current - 10);

    // --- Proximity detection ---
    let nearestTerminal = null;
    let minDist = 2.2; // interaction distance threshhold

    TERMINALS.forEach(term => {
      const dist = Math.sqrt(
        Math.pow(playerX.current - term.x, 2) + 
        Math.pow(playerZ.current - term.z, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearestTerminal = term;
      }
    });

    if (onNearTerminal) {
      onNearTerminal(nearestTerminal);
    }
  });

  return null;
}

export default function BattlefieldScene({ is3DMode, virtualDir, activeTerminalId, onNearTerminal, onUpdateWalking }) {
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
        <ambientLight intensity={0.05} color="#002200" />
        <directionalLight position={[5, 10, -5]} intensity={0.4} color="#00aa33" />
        <fog attach="fog" args={['#020402', 4, 35]} />
        
        <CameraController 
          is3DMode={is3DMode} 
          virtualDir={virtualDir}
          onNearTerminal={onNearTerminal}
          onUpdateWalking={onUpdateWalking}
        />
        
        <Embers count={400} />
        <gridHelper args={[100, 100, '#0a3a0a', '#041504']} position={[0, -2.9, 0]} />
        <DistantExplosions />

        {/* Render Pedestals & Holographic nodes */}
        {TERMINALS.map(term => (
          <group key={term.id}>
            {/* Pedestal Base */}
            <mesh position={[term.x, -1.9, term.z]}>
              <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
              <meshStandardMaterial color="#0c180c" roughness={0.7} metalness={0.5} />
            </mesh>

            {/* Pedestal Cap Glow */}
            <mesh position={[term.x, -0.9, term.z]}>
              <cylinderGeometry args={[0.32, 0.32, 0.05, 8]} />
              <meshStandardMaterial 
                color={activeTerminalId === term.id ? "#ff6a00" : "#00ff41"} 
                emissive={activeTerminalId === term.id ? "#ff6a00" : "#00ff41"} 
                emissiveIntensity={0.5}
              />
            </mesh>

            {/* Rotating Hologram Node */}
            <HoloTerminal 
              position={[term.x, -0.9, term.z]} 
              label={term.label} 
              isNear={activeTerminalId === term.id} 
            />
          </group>
        ))}

        {/* Bunker Wall pillars to define 3D depth */}
        {[-30, -24, -18, -12, -6, 0].map(z => (
          <group key={z}>
            <mesh position={[-6, -0.9, z]}>
              <boxGeometry args={[0.5, 4, 0.5]} />
              <meshStandardMaterial color="#061006" wireframe />
            </mesh>
            <mesh position={[6, -0.9, z]}>
              <boxGeometry args={[0.5, 4, 0.5]} />
              <meshStandardMaterial color="#061006" wireframe />
            </mesh>
          </group>
        ))}
      </Canvas>
    </div>
  );
}
