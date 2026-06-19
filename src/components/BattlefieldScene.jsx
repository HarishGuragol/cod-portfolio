/* ============================================================
   BattlefieldScene — 3D Outdoor Road & Bunker Hallway Walkthrough
   ============================================================ */
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const DOORS = [
  { id: 'campaign', label: 'CAMPAIGN DOSSIER', x: -4.8, z: -8, rotY: Math.PI / 2 },
  { id: 'multiplayer', label: 'MULTIPLAYER LOBBY', x: 4.8, z: -8, rotY: -Math.PI / 2 },
  { id: 'armory', label: 'ARMORY WORKBENCH', x: -4.8, z: -18, rotY: Math.PI / 2 },
  { id: 'barracks', label: 'BARRACKS RECORDS', x: 4.8, z: -18, rotY: -Math.PI / 2 },
  { id: 'comms', label: 'COMMS TRANSCEIVER', x: 0, z: -28, rotY: 0 }
];

function Embers({ count = 300 }) {
  const meshRef = useRef();
  
  const [positions, velocities, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 40;
      pos[i3 + 1] = Math.random() * 15 - 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 60;
      
      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = Math.random() * 0.008 + 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.005;
      
      col[i3] = 0.0;
      col[i3 + 1] = 0.8 + Math.random() * 0.2;
      col[i3 + 2] = 0.1 + Math.random() * 0.1;
      
      siz[i] = Math.random() * 2 + 1;
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
      
      if (posArr[i3 + 1] > 12) {
        posArr[i3] = (Math.random() - 0.5) * 40;
        posArr[i3 + 1] = -3;
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
        opacity={0.6}
        size={0.05}
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
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) light1.current.intensity = (Math.sin(t * 0.6) * 0.5 + 0.5) * 1.5;
    if (light2.current) light2.current.intensity = (Math.sin(t * 1.1 + 1.5) * 0.5 + 0.5) * 1.2;
  });
  
  return (
    <>
      <pointLight ref={light1} position={[-25, 4, -25]} color="#00ff41" distance={50} />
      <pointLight ref={light2} position={[25, 3, -15]} color="#ff6600" distance={40} />
    </>
  );
}

function BunkerDoor({ door, isNear }) {
  return (
    <group position={[door.x, 0.1, door.z]} rotation={[0, door.rotY, 0]}>
      {/* Outer Concrete Door frame */}
      <mesh position={[0, 0.8, -0.05]}>
        <boxGeometry args={[2.2, 3.4, 0.25]} />
        <meshStandardMaterial color="#0c180c" roughness={0.8} metalness={0.6} />
      </mesh>
      
      {/* Sliding Glowing Panel */}
      <mesh position={[0, 0.8, 0.05]}>
        <planeGeometry args={[1.8, 3.1]} />
        <meshStandardMaterial 
          color={isNear ? "#ff6a00" : "#00ff41"} 
          emissive={isNear ? "#ff6a00" : "#00ff41"} 
          emissiveIntensity={isNear ? 1.0 : 0.4}
          wireframe
        />
      </mesh>

      {/* Security Status Bulb */}
      <mesh position={[0, 2.2, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={isNear ? "#ff6a00" : "#00ff41"} />
      </mesh>

      {/* HTML floating label above door */}
      <Html position={[0, 2.7, 0.15]} center distanceFactor={12}>
        <div 
          className="terminal-3d-label" 
          style={{
            borderColor: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            color: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            boxShadow: isNear ? '0 0 15px rgba(255,106,0,0.3)' : '0 0 10px rgba(0,255,65,0.2)'
          }}
        >
          {door.label}
        </div>
      </Html>
    </group>
  );
}

function CameraController({ is3DMode, virtualDir, onNearTerminal, onUpdateWalking }) {
  const keys = useRef({ w: false, a: false, s: false, d: false });
  
  // Starting position: on the road at Z = 20, looking forward
  const playerX = useRef(0);
  const playerZ = useRef(20);
  
  // View rotation
  const yaw = useRef(0);
  const pitch = useRef(0);
  
  // Drag to look state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Keyboard listeners
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

    // Drag listeners for looking around
    const handleMouseDown = (e) => {
      if (e.target.closest('button, kbd, .virtual-dpad, .proximity-prompt-overlay, .hud-onboarding-panel, .hud-overlay')) return;
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current || !is3DMode) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      
      yaw.current -= deltaX * 0.005;
      pitch.current = Math.max(-0.6, Math.min(0.6, pitch.current - deltaY * 0.005));
      
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    // Touch support for drag look
    const handleTouchStart = (e) => {
      if (e.target.closest('button, kbd, .virtual-dpad, .proximity-prompt-overlay, .hud-onboarding-panel, .hud-overlay')) return;
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging.current || !is3DMode || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      
      yaw.current -= deltaX * 0.006;
      pitch.current = Math.max(-0.6, Math.min(0.6, pitch.current - deltaY * 0.006));
      
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [is3DMode]);

  useFrame((state, delta) => {
    if (!is3DMode) {
      // Cinematic overview sway
      const t = state.clock.elapsedTime;
      state.camera.position.x = Math.sin(t * 0.1) * 0.8;
      state.camera.position.y = 2.2 + Math.sin(t * 0.15) * 0.3;
      state.camera.position.z = 18;
      state.camera.lookAt(0, 1.0, 5);
      return;
    }

    // --- Keyboard rotation sway ---
    if (keys.current.a || virtualDir === 'LEFT') {
      yaw.current += 1.5 * delta;
    }
    if (keys.current.d || virtualDir === 'RIGHT') {
      yaw.current -= 1.5 * delta;
    }

    // --- Movement calculations relative to camera angle ---
    const moveSpeed = 6.5 * delta;
    let dx = 0;
    let dz = 0;

    // Movement forward/backward in direction player is looking
    const forwardX = Math.sin(yaw.current);
    const forwardZ = -Math.cos(yaw.current);

    if (keys.current.w || virtualDir === 'UP') {
      dx += forwardX * moveSpeed;
      dz += forwardZ * moveSpeed;
    }
    if (keys.current.s || virtualDir === 'DOWN') {
      dx -= forwardX * moveSpeed;
      dz -= forwardZ * moveSpeed;
    }

    // Update walking indicators
    const isWalking = dx !== 0 || dz !== 0;
    if (onUpdateWalking) {
      onUpdateWalking(isWalking);
    }

    // Bounds checking (keep on road and inside corridor width)
    playerX.current = Math.max(-4.2, Math.min(4.2, playerX.current + dx));
    playerZ.current = Math.max(-35, Math.min(22, playerZ.current + dz)); // Z Zbounds: +22 to -35

    // Eye level walking bob
    const bob = isWalking ? Math.sin(state.clock.elapsedTime * 12) * 0.05 : 0;

    // Camera height (1.6m eye level)
    state.camera.position.x = playerX.current;
    state.camera.position.y = 1.55 + bob;
    state.camera.position.z = playerZ.current;

    // Face camera along yaw and pitch orientation
    const lookX = playerX.current + Math.sin(yaw.current) * Math.cos(pitch.current);
    const lookY = 1.55 + Math.sin(pitch.current);
    const lookZ = playerZ.current - Math.cos(yaw.current) * Math.cos(pitch.current);

    state.camera.lookAt(lookX, lookY, lookZ);

    // --- Proximity & Looking Door Detection ---
    let nearestDoor = null;
    let minDist = 3.2; // trigger distance

    DOORS.forEach(door => {
      const dxVec = door.x - playerX.current;
      const dzVec = door.z - playerZ.current;
      const dist = Math.sqrt(dxVec * dxVec + dzVec * dzVec);
      
      if (dist < minDist) {
        // Calculate dot product between player facing vector and vector to door
        const fX = Math.sin(yaw.current);
        const fZ = -Math.cos(yaw.current);
        const dot = (dxVec * fX + dzVec * fZ) / dist;
        
        // Only select door if it is in front of the camera (roughly 60 degrees FOV)
        if (dot > 0.4) {
          minDist = dist;
          nearestDoor = door;
        }
      }
    });

    if (onNearTerminal) {
      onNearTerminal(nearestDoor);
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
        camera={{ position: [0, 2, 18], fov: 60, near: 0.1, far: 80 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#020402' }}
      >
        <ambientLight intensity={0.06} color="#002200" />
        <directionalLight position={[5, 12, -2]} intensity={0.4} color="#00ff41" />
        <fog attach="fog" args={['#020402', 3, 26]} />
        
        <CameraController 
          is3DMode={is3DMode} 
          virtualDir={virtualDir}
          onNearTerminal={onNearTerminal}
          onUpdateWalking={onUpdateWalking}
        />
        
        <Embers count={300} />
        <DistantExplosions />

        {/* 🛣️ THE OUTDOOR ROAD */}
        {/* Asphalt floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 10]}>
          <planeGeometry args={[12, 25]} />
          <meshStandardMaterial color="#1a1c1a" roughness={0.9} metalness={0.2} />
        </mesh>
        
        {/* Yellow center dashed lanes */}
        {[-2, 2, 6, 10, 14, 18, 22].map(z => (
          <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.88, z]}>
            <planeGeometry args={[0.15, 1.8]} />
            <meshBasicMaterial color="#ffcc00" />
          </mesh>
        ))}

        {/* Guardrails (Side fences) */}
        <mesh position={[-6, -0.9, 10]}>
          <boxGeometry args={[0.2, 2, 25]} />
          <meshStandardMaterial color="#081008" wireframe />
        </mesh>
        <mesh position={[6, -0.9, 10]}>
          <boxGeometry args={[0.2, 2, 25]} />
          <meshStandardMaterial color="#081008" wireframe />
        </mesh>

        {/* Streetlight Posts */}
        {[3, 10, 17].map(z => (
          <group key={z}>
            {/* Left Post */}
            <mesh position={[-5.8, 1.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 6]} />
              <meshStandardMaterial color="#0c180c" />
            </mesh>
            <mesh position={[-5.5, 4.1, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6]} />
              <meshStandardMaterial color="#0c180c" />
            </mesh>
            <pointLight position={[-5.2, 3.9, z]} color="#00ff41" intensity={1.2} distance={10} />

            {/* Right Post */}
            <mesh position={[5.8, 1.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 6]} />
              <meshStandardMaterial color="#0c180c" />
            </mesh>
            <mesh position={[5.5, 4.1, z]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6]} />
              <meshStandardMaterial color="#0c180c" />
            </mesh>
            <pointLight position={[5.2, 3.9, z]} color="#00ff41" intensity={1.2} distance={10} />
          </group>
        ))}

        {/* 🏢 THE CONCRETE BUNKER FACADE (Entrance Gate) */}
        <group position={[0, 0.1, -2.5]}>
          {/* Left Wall Segment */}
          <mesh position={[-4.5, 1, 0]}>
            <boxGeometry args={[3, 4.2, 0.6]} />
            <meshStandardMaterial color="#0a140a" roughness={0.85} metalness={0.4} />
          </mesh>
          {/* Right Wall Segment */}
          <mesh position={[4.5, 1, 0]}>
            <boxGeometry args={[3, 4.2, 0.6]} />
            <meshStandardMaterial color="#0a140a" roughness={0.85} metalness={0.4} />
          </mesh>
          {/* Arch Ceiling Beam */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[6, 0.8, 0.6]} />
            <meshStandardMaterial color="#0a140a" roughness={0.85} metalness={0.4} />
          </mesh>
          {/* Entrance Arch Frame Glow */}
          <mesh position={[0, 1.1, 0.3]}>
            <boxGeometry args={[6, 4, 0.15]} />
            <meshStandardMaterial color="#00ff41" wireframe emissive="#00ff41" emissiveIntensity={0.1} />
          </mesh>
        </group>

        {/* 🏢 INSIDE BUNKER CORRIDOR */}
        {/* Hallway Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, -17.5]}>
          <planeGeometry args={[10, 30]} />
          <meshStandardMaterial color="#090b09" roughness={0.7} metalness={0.5} />
        </mesh>
        
        {/* Corridor Side Walls (Concrete Grid) */}
        <mesh position={[-5, 1.1, -17.5]}>
          <boxGeometry args={[0.2, 6, 30]} />
          <meshStandardMaterial color="#061206" wireframe />
        </mesh>
        <mesh position={[5, 1.1, -17.5]}>
          <boxGeometry args={[0.2, 6, 30]} />
          <meshStandardMaterial color="#061206" wireframe />
        </mesh>

        {/* Ceiling Panels */}
        <mesh position={[0, 4.1, -17.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 30]} />
          <meshStandardMaterial color="#030803" roughness={0.9} />
        </mesh>
        
        {/* Back Wall (Corridor End) */}
        <mesh position={[0, 1.1, -32.5]}>
          <boxGeometry args={[10, 6, 0.2]} />
          <meshStandardMaterial color="#061206" wireframe />
        </mesh>

        {/* 🚪 RENDER THE DOORS */}
        {DOORS.map(door => (
          <BunkerDoor 
            key={door.id}
            door={door}
            isNear={activeTerminalId === door.id}
          />
        ))}
      </Canvas>
    </div>
  );
}
