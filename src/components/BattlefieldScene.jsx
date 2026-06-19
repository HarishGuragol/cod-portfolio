/* ============================================================
   BattlefieldScene — GTA 5 Los Santos & Special Ops Night Vision
   ============================================================ */
import { useRef, useMemo, useEffect, forwardRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Sky, Environment, Sparkles, Cloud, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

const DOORS = [
  { id: 'campaign', label: 'CAMPAIGN DOSSIER', x: -4.8, z: -8, rotY: Math.PI / 2 },
  { id: 'multiplayer', label: 'MULTIPLAYER LOBBY', x: 4.8, z: -8, rotY: -Math.PI / 2 },
  { id: 'armory', label: 'ARMORY WORKBENCH', x: -4.8, z: -18, rotY: Math.PI / 2 },
  { id: 'barracks', label: 'BARRACKS RECORDS', x: 4.8, z: -18, rotY: -Math.PI / 2 },
  { id: 'comms', label: 'COMMS TRANSCEIVER', x: 0, z: -28, rotY: 0 }
];

function DistantExplosions({ nightVision }) {
  const light1 = useRef();
  const light2 = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) light1.current.intensity = (Math.sin(t * 0.6) * 0.5 + 0.5) * (nightVision ? 1.5 : 0.8);
    if (light2.current) light2.current.intensity = (Math.sin(t * 1.1 + 1.5) * 0.5 + 0.5) * (nightVision ? 1.2 : 0.6);
  });
  
  return (
    <>
      <pointLight ref={light1} position={[-45, 6, -35]} color={nightVision ? "#00ff41" : "#ffe8aa"} distance={70} />
      <pointLight ref={light2} position={[45, 5, -25]} color={nightVision ? "#ff6600" : "#aaccff"} distance={60} />
    </>
  );
}

function PalmTree({ position, nightVision }) {
  const trunkColor = nightVision ? "#041504" : "#4a321a";
  const leafColor = nightVision ? "#00ff41" : "#1e4620";
  const wireframe = nightVision;
  
  return (
    <group position={position}>
      {/* Detailed Segmented Trunk with Natural Organic Curve */}
      <group>
        {[0, 1, 2, 3, 4, 5, 6, 7].map(idx => {
          const height = 0.65;
          const yPos = idx * height;
          const xOffset = Math.sin(idx * 0.35) * 0.08;
          const zOffset = Math.cos(idx * 0.35) * 0.05;
          const scale = 1.0 - idx * 0.04;
          return (
            <group key={idx} position={[xOffset, yPos, zOffset]} scale={[scale, 1, scale]}>
              <mesh position={[0, height / 2, 0]}>
                <cylinderGeometry args={[0.13, 0.17, height, 10]} />
                <meshStandardMaterial color={trunkColor} roughness={0.95} wireframe={wireframe} />
              </mesh>
              {/* Bark Texture ring ridge */}
              <mesh position={[0, height, 0]}>
                <torusGeometry args={[0.17, 0.04, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} wireframe={wireframe} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Drooping Palm Fronds at the Top */}
      <group position={[Math.sin(7 * 0.35) * 0.08, 5.2, Math.cos(7 * 0.35) * 0.05]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          return (
            <group key={i} rotation={[0.25, angle, -0.3]}>
              {/* Main Stem */}
              <mesh position={[1.0, 0, 0]}>
                <boxGeometry args={[2.0, 0.02, 0.04]} />
                <meshStandardMaterial color={trunkColor} roughness={0.9} wireframe={wireframe} />
              </mesh>
              {/* Detailed Leaflets along the stem */}
              {Array.from({ length: 10 }).map((_, k) => {
                const dist = 0.2 + k * 0.16;
                const leafLen = 0.45 - Math.abs(k - 5) * 0.05;
                return (
                  <mesh key={k} position={[dist, -0.04, 0]} rotation={[0.35, 0, 0.15]}>
                    <boxGeometry args={[0.02, 0.01, leafLen]} />
                    <meshStandardMaterial color={leafColor} roughness={0.8} wireframe={wireframe} />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>
    </group>
  );
}

function SearchlightTower({ position, nightVision }) {
  const cylinderRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = Math.sin(t * 0.6) * 0.6;
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y = angle;
    }
  });
  
  const metalColor = nightVision ? "#081c08" : "#323632";
  const lightColor = nightVision ? "#00ff41" : "#ffffff";
  const beamColor = nightVision ? "#00ff41" : "#ffe8aa";
  
  return (
    <group position={position}>
      {/* 4-Pillar Corner Columns */}
      {[
        [-0.4, -0.4],
        [0.4, -0.4],
        [-0.4, 0.4],
        [0.4, 0.4]
      ].map(([xSign, zSign], idx) => (
        <mesh key={idx} position={[xSign * 0.3, 2.5, zSign * 0.3]} rotation={[xSign * -0.06, 0, zSign * 0.06]}>
          <cylinderGeometry args={[0.03, 0.05, 5, 4]} />
          <meshStandardMaterial color={metalColor} roughness={0.7} metalness={0.8} />
        </mesh>
      ))}

      {/* Horizontal struts */}
      {[1.25, 2.5, 3.75].map((yHeight, idx) => (
        <group key={idx} position={[0, yHeight, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[0.7, 0.03, 0.03]} />
            <meshStandardMaterial color={metalColor} roughness={0.7} metalness={0.8} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.7, 0.03, 0.03]} />
            <meshStandardMaterial color={metalColor} roughness={0.7} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Diagonal X Bracing wires */}
      {[0.6, 1.8, 3.0].map((yCenter, idx) => (
        <group key={idx} position={[0, yCenter + 0.6, 0]}>
          {/* North face */}
          <mesh position={[0, 0, 0.35]} rotation={[0, 0, 0.9]}>
            <boxGeometry args={[0.9, 0.015, 0.015]} />
            <meshStandardMaterial color={metalColor} opacity={0.6} transparent />
          </mesh>
          <mesh position={[0, 0, 0.35]} rotation={[0, 0, -0.9]}>
            <boxGeometry args={[0.9, 0.015, 0.015]} />
            <meshStandardMaterial color={metalColor} opacity={0.6} transparent />
          </mesh>
          {/* East face */}
          <mesh position={[0.35, 0, 0]} rotation={[0.9, Math.PI / 2, 0]}>
            <boxGeometry args={[0.9, 0.015, 0.015]} />
            <meshStandardMaterial color={metalColor} opacity={0.6} transparent />
          </mesh>
          <mesh position={[0.35, 0, 0]} rotation={[-0.9, Math.PI / 2, 0]}>
            <boxGeometry args={[0.9, 0.015, 0.015]} />
            <meshStandardMaterial color={metalColor} opacity={0.6} transparent />
          </mesh>
        </group>
      ))}
      
      {/* Platform Deck Floor */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[1.1, 0.05, 1.1]} />
        <meshStandardMaterial color={metalColor} roughness={0.9} metalness={0.7} />
      </mesh>
      
      {/* Platform Guard Railings */}
      {[
        { pos: [0, 5.3, 0.52], rot: [0, 0, 0], size: [1.1, 0.5, 0.02] },
        { pos: [0, 5.3, -0.52], rot: [0, 0, 0], size: [1.1, 0.5, 0.02] },
        { pos: [0.52, 5.3, 0], rot: [0, Math.PI / 2, 0], size: [1.1, 0.5, 0.02] },
        { pos: [-0.52, 5.3, 0], rot: [0, Math.PI / 2, 0], size: [1.1, 0.5, 0.02] }
      ].map((rail, idx) => (
        <mesh key={idx} position={rail.pos} rotation={rail.rot}>
          <boxGeometry args={rail.size} />
          <meshStandardMaterial color={metalColor} roughness={0.7} wireframe />
        </mesh>
      ))}
      
      {/* Rotating Searchlight Head */}
      <group position={[0, 5.4, 0]} ref={cylinderRef}>
        {/* Yoke Bracket mount */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.15]} />
          <meshStandardMaterial color={metalColor} roughness={0.7} />
        </mesh>
        <mesh position={[0.22, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color={metalColor} roughness={0.7} />
        </mesh>
        <mesh position={[-0.22, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color={metalColor} roughness={0.7} />
        </mesh>

        {/* Lamp housing */}
        <group position={[0, 0.35, 0]} rotation={[0.2, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.18, 0.5, 12]} />
            <meshStandardMaterial color={metalColor} roughness={0.6} metalness={0.8} />
          </mesh>
          {/* Glass Face lens */}
          <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.02, 12]} />
            <meshBasicMaterial color={lightColor} />
          </mesh>
          
          {/* Light source point */}
          <pointLight position={[0, 0, -0.3]} color={beamColor} intensity={1.5} distance={20} />

          {/* Volumetric cone light beam */}
          <mesh position={[0, 0, -5.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 1.8, 10.0, 24, 1, true]} />
            <meshBasicMaterial 
              color={beamColor} 
              transparent 
              opacity={nightVision ? 0.09 : 0.16} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        </group>
      </group>
      {/* Tower warning beacons */}
      <TowerBeacon position={[-0.52, 5.5, -0.52]} nightVision={nightVision} />
      <TowerBeacon position={[0.52, 5.5, 0.52]} nightVision={nightVision} />
    </group>
  );
}

function SteelIBeam({ rotation, color, wireframe }) {
  const metalness = 0.85;
  const roughness = 0.35;
  return (
    <group rotation={rotation}>
      {/* Central Web */}
      <mesh>
        <boxGeometry args={[0.02, 0.12, 1.35]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} wireframe={wireframe} />
      </mesh>
      {/* Flange 1 */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.1, 0.02, 1.35]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} wireframe={wireframe} />
      </mesh>
      {/* Flange 2 */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[0.1, 0.02, 1.35]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

function TankTrap({ position, nightVision }) {
  const color = nightVision ? "#041404" : "#3e4245";
  return (
    <group position={position}>
      {/* 3 Crossed steel I-beams */}
      <SteelIBeam rotation={[0.7, 0.7, 0]} color={color} wireframe={nightVision} />
      <SteelIBeam rotation={[-0.7, 0.7, 0]} color={color} wireframe={nightVision} />
      <SteelIBeam rotation={[0, 0.7, 0.7]} color={color} wireframe={nightVision} />
      
      {/* Central joining gusset plate */}
      <mesh position={[0, 0, 0]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.9} wireframe={nightVision} />
      </mesh>
      {/* Gusset plate brackets */}
      <mesh position={[0, 0.08, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.9} wireframe={nightVision} />
      </mesh>
    </group>
  );
}

function TowerBeacon({ position, nightVision }) {
  const beaconRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beaconRef.current) {
      beaconRef.current.intensity = (Math.sin(t * 5.0) > 0) ? (nightVision ? 1.5 : 2.5) : 0;
    }
  });
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff1111" />
      </mesh>
      <pointLight ref={beaconRef} color="#ff1111" distance={8} decay={2} />
    </group>
  );
}

function JerseyBarrier({ position, nightVision }) {
  const concreteColor = nightVision ? "#081608" : "#8c8e90";
  const stripesColor = nightVision ? "#00ff41" : "#dca818"; // yellow caution paint stripes
  const wireframe = nightVision;
  
  return (
    <group position={position}>
      {/* Base block */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.5, 0.2, 3.8]} />
        <meshStandardMaterial color={concreteColor} roughness={0.95} wireframe={wireframe} />
      </mesh>
      {/* Sloped mid */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.34, 0.2, 3.8]} />
        <meshStandardMaterial color={concreteColor} roughness={0.95} wireframe={wireframe} />
      </mesh>
      {/* Top stem */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.18, 0.3, 3.8]} />
        <meshStandardMaterial color={concreteColor} roughness={0.95} wireframe={wireframe} />
      </mesh>
      {/* Reflective warning marker or yellow warning stripes on the sides */}
      {!nightVision && (
        <group>
          <mesh position={[0.1, 0.3, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.4]} />
            <meshStandardMaterial color={stripesColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.1, 0.3, 0]}>
            <boxGeometry args={[0.16, 0.05, 0.4]} />
            <meshStandardMaterial color={stripesColor} roughness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function MilitarySign({ position, rotation, title, subtitle, nightVision }) {
  const postColor = nightVision ? "#081408" : "#444b44";
  const plateColor = nightVision ? "#020802" : "#212529";
  const textColor = nightVision ? "#00ff41" : "#ff1100";
  const wireframe = nightVision;
  
  return (
    <group position={position} rotation={rotation}>
      {/* Metal Post */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 2.2, 8]} />
        <meshStandardMaterial color={postColor} metalness={0.7} roughness={0.4} wireframe={wireframe} />
      </mesh>
      {/* Sign Plate */}
      <mesh position={[0, 1.8, 0.04]}>
        <boxGeometry args={[1.4, 0.9, 0.03]} />
        <meshStandardMaterial color={plateColor} metalness={0.8} roughness={0.3} wireframe={wireframe} />
      </mesh>
      {/* Sign Border Accent */}
      <mesh position={[0, 1.8, 0.056]}>
        <boxGeometry args={[1.32, 0.82, 0.01]} />
        <meshStandardMaterial color={textColor} wireframe={wireframe} />
      </mesh>
      {/* Sign Inner Plate */}
      <mesh position={[0, 1.8, 0.06]}>
        <boxGeometry args={[1.3, 0.8, 0.01]} />
        <meshStandardMaterial color={plateColor} roughness={0.5} />
      </mesh>
      {/* Interactive HTML Text */}
      <Html 
        position={[0, 1.8, 0.07]} 
        center 
        distanceFactor={8} 
        transform 
        rotation={[0, 0, 0]}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '180px',
          height: '110px',
          background: '#1a1d20',
          border: `3px double ${textColor}`,
          color: textColor,
          fontFamily: '"Courier New", Courier, monospace',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '6px',
          boxSizing: 'border-box',
          borderRadius: '4px',
          opacity: nightVision ? 0.95 : 1,
          pointerEvents: 'none'
        }}>
          <div style={{ fontSize: '12px', letterSpacing: '1px', marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ 
            fontSize: '7px', 
            color: nightVision ? '#00ff41' : '#ffffff', 
            borderTop: `1px solid ${textColor}`, 
            paddingTop: '4px',
            width: '100%'
          }}>
            {subtitle}
          </div>
        </div>
      </Html>
    </group>
  );
}

function OverheadFloodlight({ position, nightVision }) {
  const lightRef = useRef();
  const metalColor = nightVision ? "#081c08" : "#222522";
  const beamColor = nightVision ? "#00ff41" : "#ffeedd";
  
  return (
    <group position={position}>
      {/* Light casing box/cylinder */}
      <mesh rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.25, 8]} />
        <meshStandardMaterial color={metalColor} roughness={0.6} metalness={0.8} />
      </mesh>
      {/* Glowing lens */}
      <mesh position={[0, -0.12, 0.03]} rotation={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
        <meshBasicMaterial color={beamColor} />
      </mesh>
      {/* Spotlight casting light onto the entrance lane */}
      <spotLight
        ref={lightRef}
        position={[0, -0.12, 0.03]}
        color={beamColor}
        intensity={nightVision ? 3.5 : 6.0}
        distance={18}
        angle={0.65}
        penumbra={0.6}
        castShadow={false}
      />
      {/* Visual volumetric cone */}
      <mesh position={[0, -3.0, 1.2]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.05, 1.8, 6.0, 16, 1, true]} />
        <meshBasicMaterial 
          color={beamColor} 
          transparent 
          opacity={nightVision ? 0.07 : 0.12} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

function RazorWire({ position, length, nightVision }) {
  const wireColor = nightVision ? "#00ff41" : "#555b55";
  const ringCount = Math.floor(length * 2.5);
  return (
    <group position={position}>
      {/* Horizontal support wires */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[length, 0.01, 0.01]} />
        <meshStandardMaterial color={wireColor} roughness={0.5} />
      </mesh>
      {/* Coils */}
      {Array.from({ length: ringCount }).map((_, i) => {
        const xPos = -length / 2 + (i / ringCount) * length;
        return (
          <mesh key={i} position={[xPos, 0.15, 0]} rotation={[0, 0.3, 1.2]}>
            <torusGeometry args={[0.22, 0.012, 6, 12]} />
            <meshStandardMaterial color={wireColor} roughness={0.4} metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}


const Soldier = forwardRef(({ isWalking, nightVision }, ref) => {
  const { scene, animations } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/Soldier.glb');
  
  // Save original materials (run once when scene loads)
  const originalMaterials = useMemo(() => {
    const map = new Map();
    scene.traverse((child) => {
      if (child.isMesh) {
        map.set(child.uuid, child.material);
      }
    });
    return map;
  }, [scene]);

  // Apply night vision effect to soldier meshes directly (no clone to prevent skeletal binding breaks)
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (nightVision) {
          child.material = new THREE.MeshBasicMaterial({
            color: '#00ff41',
            wireframe: true
          });
        } else {
          const orig = originalMaterials.get(child.uuid);
          if (orig) {
            child.material = orig;
          }
        }
      }
    });
  }, [scene, nightVision, originalMaterials]);

  // Skeletal animations controller targeting localRef to isolate character meshes from parent coordinates
  const localRef = useRef();
  const { actions } = useAnimations(animations, localRef);

  useEffect(() => {
    if (!actions) return;
    const idleAction = actions['Idle'];
    const walkAction = actions['Walk'];

    if (isWalking) {
      if (idleAction) idleAction.fadeOut(0.15);
      if (walkAction) walkAction.reset().fadeIn(0.15).play();
    } else {
      if (walkAction) walkAction.fadeOut(0.15);
      if (idleAction) idleAction.reset().fadeIn(0.15).play();
    }
    return () => {
      if (walkAction) walkAction.fadeOut(0.15);
      if (idleAction) idleAction.fadeOut(0.15);
    };
  }, [isWalking, actions]);

  return (
    <group ref={ref}>
      <group ref={localRef}>
        <primitive 
          object={scene} 
          scale={[1.15, 1.15, 1.15]} 
          position={[0, 0, 0]} 
          rotation={[0, Math.PI, 0]} 
        />
      </group>
    </group>
  );
});
Soldier.displayName = 'Soldier';

function BunkerDoor({ door, isNear, nightVision }) {
  // Fix CSS variable warning inside standard materials
  const panelColor = nightVision 
    ? (isNear ? "#ff6a00" : "#00ff41") 
    : (isNear ? "#ff6a00" : "#00aaff");

  return (
    <group position={[door.x, 0.1, door.z]} rotation={[0, door.rotY, 0]}>
      {/* Concrete Door Frame */}
      <mesh position={[0, 0.8, -0.05]}>
        <boxGeometry args={[2.2, 3.4, 0.25]} />
        <meshStandardMaterial color={nightVision ? "#0c180c" : "#2d2d2d"} roughness={0.85} metalness={0.5} />
      </mesh>
      
      {/* Sliding Glowing Panel */}
      <mesh position={[0, 0.8, 0.05]}>
        <planeGeometry args={[1.8, 3.1]} />
        <meshStandardMaterial 
          color={panelColor} 
          emissive={panelColor} 
          emissiveIntensity={isNear ? 1.0 : 0.4}
          wireframe
        />
      </mesh>

      {/* Security Status Light */}
      <mesh position={[0, 2.2, 0.1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={panelColor} />
      </mesh>

      {/* Biometric Security Scanner Terminal next to each door */}
      <group position={[1.25, 0.4, 0.1]}>
        {/* Mounting post */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
          <meshStandardMaterial color={nightVision ? "#041004" : "#1a1a1a"} roughness={0.9} />
        </mesh>
        {/* Scanner Head box */}
        <mesh position={[0, 0.1, 0]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[0.16, 0.24, 0.1]} />
          <meshStandardMaterial color={nightVision ? "#081c08" : "#2d2d2d"} roughness={0.7} metalness={0.6} />
        </mesh>
        {/* Glowing Screen scanner pad */}
        <mesh position={[0, 0.1, 0.051]} rotation={[0.15, 0, 0]}>
          <planeGeometry args={[0.12, 0.16]} />
          <meshBasicMaterial color={isNear ? "#00ff41" : "#ff1100"} />
        </mesh>
      </group>

      {/* HTML floating label above door (GTA 5 Heists styling in Daylight) */}
      <Html position={[0, 2.7, 0.15]} center distanceFactor={12}>
        <div 
          className={nightVision ? "terminal-3d-label" : "terminal-3d-label gta-mode"}
          style={nightVision ? {
            borderColor: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            color: isNear ? 'var(--cod-secondary)' : 'var(--cod-primary)',
            boxShadow: isNear ? '0 0 15px rgba(255,106,0,0.3)' : '0 0 10px rgba(0,255,65,0.2)'
          } : {
            borderLeftColor: isNear ? 'var(--cod-secondary)' : 'white'
          }}
        >
          {door.label}
        </div>
      </Html>
    </group>
  );
}

function CameraController({ is3DMode, virtualDir, onNearTerminal, onUpdateWalking, nightVision, controlsRef }) {
  const keys = useRef({ w: false, a: false, s: false, d: false, space: false });
  const soldierRef = useRef();
  
  // Starting position: far back on the road at Z = 45 looking towards the bunker
  const playerX = useRef(0);
  const playerY = useRef(-1.9); // Ground height
  const playerZ = useRef(45);
  
  // Velocities
  const vx = useRef(0);
  const vy = useRef(0);
  const vz = useRef(0);
  
  // Soldier rotation angle
  const yaw = useRef(0);
  const isWalkingRef = useRef(false);

  // Mouse click coordinates path target
  const moveTarget = useRef(null);

  const { camera, raycaster, scene, gl } = useThree();

  // Set initial follow camera coordinates
  useEffect(() => {
    if (is3DMode && camera && controlsRef.current) {
      camera.position.set(0, 1.8, 49.5);
      controlsRef.current.target.set(0, -1.9, 45);
      controlsRef.current.update();
    }
  }, [is3DMode, camera, controlsRef]);

  // Click-to-move pointer raycasting listener with Drag filter
  useEffect(() => {
    if (!is3DMode) return;

    let startX = 0;
    let startY = 0;

    const handlePointerDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
    };

    const handlePointerUp = (e) => {
      // Ignore click on UI buttons and HUD overlays
      if (e.target.closest('button, kbd, .virtual-dpad, .proximity-prompt-overlay, .hud-onboarding-panel, .hud-objectives, .hud-container, .section-back-btn')) return;

      const diffX = Math.abs(e.clientX - startX);
      const diffY = Math.abs(e.clientY - startY);
      
      // If user dragged the mouse (more than 5px), ignore it (it was a camera rotation)
      if (diffX > 5 || diffY > 5) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const mouse = new THREE.Vector2(x, y);
      raycaster.setFromCamera(mouse, camera);

      // Raycast against road pavement and terrain floor
      const intersects = raycaster.intersectObjects(scene.children, true);
      const groundIntersection = intersects.find(intersect => 
        intersect.object.name === 'road-pavement' || intersect.object.name === 'ground-terrain'
      );

      if (groundIntersection) {
        const point = groundIntersection.point;
        // Outdoors max width is 8.2, interior max width is 4.2
        const maxW = point.z <= -2.5 ? 4.2 : 8.2;
        moveTarget.current = new THREE.Vector3(
          Math.max(-maxW, Math.min(maxW, point.x)),
          -1.9,
          Math.max(-35, Math.min(70, point.z))
        );
      }
    };

    gl.domElement.addEventListener('pointerdown', handlePointerDown);
    gl.domElement.addEventListener('pointerup', handlePointerUp);
    return () => {
      gl.domElement.removeEventListener('pointerdown', handlePointerDown);
      gl.domElement.removeEventListener('pointerup', handlePointerUp);
    };
  }, [is3DMode, camera, raycaster, scene, gl]);

  useEffect(() => {
    // Keyboard listeners
    const handleKeyDown = (e) => {
      if (!is3DMode) return;
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.w = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.s = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = true;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault(); // Prevent browser scrolling
        keys.current.space = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.w = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.s = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.a = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.d = false;
      if (e.key === ' ' || e.key === 'Spacebar') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [is3DMode]);

  // Collision checking function
  const checkCollision = (x, z, y) => {
    const radius = 0.35; // Player bounding sphere radius
    
    // 1. Boundary limits
    const maxW = z <= -2.5 ? (4.2 - radius) : (8.2 - radius);
    if (x < -maxW || x > maxW) return true;
    if (z < (-32.5 + radius) || z > (70 - radius)) return true;

    // 2. Gateway pillars (Left & Right concrete portal frame walls)
    // Left pillar box: X in [-6.0, -3.0], Z in [-2.8, -2.2]
    // Expanded by player radius: X in [-6.35, -2.65], Z in [-3.15, -1.85]
    if (x >= -6.35 && x <= -2.65 && z >= -3.15 && z <= -1.85) return true;
    
    // Right pillar box: X in [3.0, 6.0], Z in [-2.8, -2.2]
    // Expanded by player radius: X in [2.65, 6.35], Z in [-3.15, -1.85]
    if (x >= 2.65 && x <= 6.35 && z >= -3.15 && z <= -1.85) return true;

    // 3. Tank Traps (Radius circle checks)
    // Tank traps are at X = -8.3 and X = 8.3, and Z = -22, -10, 5, 20, 35, 50, 65.
    // If the player is in mid-air (y >= -1.4), they can jump over them.
    if (y < -1.4) {
      const trapZs = [-22, -10, 5, 20, 35, 50, 65];
      const trapXs = [-8.3, 8.3];
      const combinedRadius = 1.05; // Trap radius (0.7) + Player radius (0.35)
      for (let tz of trapZs) {
        for (let tx of trapXs) {
          const dx = x - tx;
          const dz = z - tz;
          if (dx * dx + dz * dz < combinedRadius * combinedRadius) {
            return true;
          }
        }
      }
    }

    // 4. Center Jersey Barriers (X in [-0.25, 0.25], Z in [-2.0, 70])
    // Expanded by player radius: X in [-0.6, 0.6]
    // If the player is in mid-air (y >= -1.3), they can jump over them.
    if (y < -1.3) {
      if (x >= -0.6 && x <= 0.6 && z >= -2.0 && z <= 70) {
        return true;
      }
    }

    return false;
  };

  useFrame((state, delta) => {
    if (!is3DMode) {
      // Cinematic overview sway
      const t = state.clock.elapsedTime;
      state.camera.position.x = Math.sin(t * 0.1) * 1.5;
      state.camera.position.y = 2.5 + Math.sin(t * 0.15) * 0.5;
      state.camera.position.z = 24;
      state.camera.lookAt(0, 0.5, 8);
      return;
    }

    // --- Calculate movement vectors relative to camera looking angle ---
    const camDir = new THREE.Vector3();
    state.camera.getWorldDirection(camDir);
    camDir.y = 0;
    camDir.normalize();

    const camRight = new THREE.Vector3();
    camRight.crossVectors(camDir, new THREE.Vector3(0, 1, 0)).normalize();

    // Physics constants
    const acceleration = 35.0; // units/s^2
    const friction = 12.0; // sliding friction factor
    const maxSpeed = 6.5; // units/s
    const gravity = 22.0; // units/s^2
    const jumpForce = 8.5; // initial vertical velocity

    let ax = 0;
    let az = 0;

    // Keyboard controls override mouse target
    const keyboardMoving = keys.current.w || keys.current.s || keys.current.a || keys.current.d || virtualDir !== '';

    if (keyboardMoving) {
      moveTarget.current = null; // Cancel mouse navigation target
      
      if (keys.current.w || virtualDir === 'UP') {
        ax += camDir.x;
        az += camDir.z;
      }
      if (keys.current.s || virtualDir === 'DOWN') {
        ax -= camDir.x;
        az -= camDir.z;
      }
      if (keys.current.a || virtualDir === 'LEFT') {
        ax -= camRight.x;
        az -= camRight.z;
      }
      if (keys.current.d || virtualDir === 'RIGHT') {
        ax += camRight.x;
        az += camRight.z;
      }

      // Normalize acceleration vector
      const len = Math.sqrt(ax * ax + az * az);
      if (len > 0) {
        ax = (ax / len) * acceleration;
        az = (az / len) * acceleration;
      }
    } else if (moveTarget.current) {
      // Walk towards mouse target
      const target = moveTarget.current;
      const toTargetX = target.x - playerX.current;
      const toTargetZ = target.z - playerZ.current;
      const dist = Math.sqrt(toTargetX * toTargetX + toTargetZ * toTargetZ);
      
      if (dist > 0.15) {
        ax = (toTargetX / dist) * acceleration;
        az = (toTargetZ / dist) * acceleration;
      } else {
        moveTarget.current = null; // Reached!
      }
    }

    // Apply acceleration forces to velocity
    vx.current += ax * delta;
    vz.current += az * delta;

    // Apply friction damping
    const damp = Math.exp(-friction * delta);
    vx.current *= damp;
    vz.current *= damp;

    // Cap velocity
    const currentSpeed = Math.sqrt(vx.current * vx.current + vz.current * vz.current);
    if (currentSpeed > maxSpeed) {
      vx.current = (vx.current / currentSpeed) * maxSpeed;
      vz.current = (vz.current / currentSpeed) * maxSpeed;
    }

    // --- Jump & Gravity physics ---
    if (keys.current.space && playerY.current <= -1.9) {
      vy.current = jumpForce;
    }
    // Apply gravity
    vy.current -= gravity * delta;
    playerY.current += vy.current * delta;
    // Ground level clamp
    if (playerY.current <= -1.9) {
      playerY.current = -1.9;
      vy.current = 0;
    }

    // Calculate candidate next position
    const nextX = playerX.current + vx.current * delta;
    const nextZ = playerZ.current + vz.current * delta;

    // Split collision tests to allow sliding along walls
    let collX = checkCollision(nextX, playerZ.current, playerY.current);
    let collZ = checkCollision(playerX.current, nextZ, playerY.current);

    if (collX) {
      vx.current = 0;
      if (moveTarget.current) moveTarget.current = null;
    } else {
      playerX.current = nextX;
    }

    if (collZ) {
      vz.current = 0;
      if (moveTarget.current) moveTarget.current = null;
    } else {
      playerZ.current = nextZ;
    }

    // Update walking indicators
    const isWalking = currentSpeed > 0.15;
    isWalkingRef.current = isWalking;
    if (onUpdateWalking) {
      onUpdateWalking(isWalking);
    }

    // Eye level follow bob
    const bob = isWalking && playerY.current <= -1.9 ? Math.sin(state.clock.elapsedTime * 12) * 0.04 : 0;

    // Rotate soldier character in the direction of movement velocity
    if (isWalking) {
      yaw.current = Math.atan2(vx.current, vz.current);
    }

    // Lock OrbitControls target to player coordinates (so camera orbits and follows player)
    if (controlsRef.current) {
      controlsRef.current.target.set(playerX.current, playerY.current + 0.9 + bob, playerZ.current);
    }

    // Update soldier position and rotation
    if (soldierRef.current) {
      soldierRef.current.position.set(playerX.current, playerY.current, playerZ.current);
      soldierRef.current.rotation.y = yaw.current;
    }

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
        
        // Only select door if the player is looking towards it
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

  return (
    <Soldier 
      ref={soldierRef} 
      isWalking={isWalkingRef.current} 
      nightVision={nightVision}
    />
  );
}

export default function BattlefieldScene({ is3DMode, virtualDir, activeTerminalId, onNearTerminal, onUpdateWalking, nightVision }) {
  const controlsRef = useRef();

  // Update skybox container gradient dynamically based on theme
  useEffect(() => {
    const root = document.querySelector('.app-root');
    if (!root) return;
    if (nightVision) {
      root.style.background = '#020402';
    } else {
      // Clear CSS background to let Drei Sky Dome render fully
      root.style.background = 'transparent';
    }
  }, [nightVision]);

  // Dual-theme light colors
  const ambientColor = nightVision ? "#002200" : "#99b8ff";
  const ambientIntensity = nightVision ? 0.05 : 0.6;
  const sunColor = nightVision ? "#00aa33" : "#fffbf0";
  const sunIntensity = nightVision ? 0.4 : 1.35;
  const fogColor = nightVision ? "#020402" : "#b9d8f6";
  const fogNear = nightVision ? 5 : 10;
  const fogFar = nightVision ? 45 : 95;

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
        camera={{ position: [0, 2, 50], fov: 60, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: nightVision ? '#020402' : 'transparent' }}
      >
        <ambientLight intensity={ambientIntensity} color={ambientColor} />
        <directionalLight position={[15, 25, 15]} intensity={sunIntensity} color={sunColor} />
        {!nightVision && <directionalLight position={[-15, 12, -15]} intensity={0.35} color="#aaccff" />}
        
        <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
        
        {/* Wrap GLTF loader in Suspense */}
        <Suspense fallback={null}>
          <CameraController 
            is3DMode={is3DMode} 
            virtualDir={virtualDir}
            onNearTerminal={onNearTerminal}
            onUpdateWalking={onUpdateWalking}
            nightVision={nightVision}
            controlsRef={controlsRef}
          />
        </Suspense>
        
        {/* THREE-DIMENSIONAL ATMOSPHERICS (Drei Sparkles library) */}
        <Sparkles 
          count={150} 
          scale={[24, 8, 120]} 
          size={1.5} 
          speed={0.4} 
          color={nightVision ? "#00ff41" : "#ffe8aa"} 
        />
        
        <DistantExplosions nightVision={nightVision} />

        {/* 🌎 3D DREI SKYBOX (Atmospheric daylight / Sunset) */}
        {!nightVision ? (
          <Sky 
            distance={450000} 
            sunPosition={[15, 12, 10]} 
            turbidity={6} 
            rayleigh={1.2} 
            mieCoefficient={0.003} 
            mieDirectionalG={0.8} 
          />
        ) : (
          <mesh scale={[-1, 1, 1]} position={[0, 0, 0]}>
            <sphereGeometry args={[120, 16, 12]} />
            <meshBasicMaterial color="#010501" side={THREE.BackSide} fog={false} />
          </mesh>
        )}

        {/* 🏔️ massive distant 3D low-poly mountain ranges */}
        <group position={[0, -2, -55]}>
          {/* Center peak */}
          <mesh position={[0, 4, 0]}>
            <coneGeometry args={[32, 42, 4]} />
            <meshStandardMaterial color={nightVision ? "#030c03" : "#323c47"} roughness={0.9} flatShading wireframe={nightVision} />
          </mesh>
          {/* Left peaks */}
          <mesh position={[-38, 2, 5]}>
            <coneGeometry args={[26, 32, 4]} />
            <meshStandardMaterial color={nightVision ? "#041004" : "#45505e"} roughness={0.9} flatShading wireframe={nightVision} />
          </mesh>
          <mesh position={[-75, 0, 15]}>
            <coneGeometry args={[35, 45, 4]} />
            <meshStandardMaterial color={nightVision ? "#041004" : "#2f3842"} roughness={0.9} flatShading wireframe={nightVision} />
          </mesh>
          {/* Right peaks */}
          <mesh position={[38, 2, 3]}>
            <coneGeometry args={[28, 35, 4]} />
            <meshStandardMaterial color={nightVision ? "#041004" : "#3d4854"} roughness={0.9} flatShading wireframe={nightVision} />
          </mesh>
          <mesh position={[75, 0, 12]}>
            <coneGeometry args={[34, 44, 4]} />
            <meshStandardMaterial color={nightVision ? "#041004" : "#303942"} roughness={0.9} flatShading wireframe={nightVision} />
          </mesh>
        </group>

        {/* ☁️ 3D DRIFTING CLOUDS (Daylight mode only) */}
        {!nightVision && (
          <>
            <Cloud position={[-25, 18, 15]} speed={0.4} />
            <Cloud position={[20, 20, -10]} speed={0.3} />
            <Cloud position={[-10, 22, -35]} speed={0.5} />
            <Cloud position={[35, 16, 40]} speed={0.3} />
          </>
        )}

        {/* 🌎 Giant Landscape Ground Floor */}
        <mesh name="ground-terrain" rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.92, 15]}>
          <planeGeometry args={[300, 200]} />
          <meshStandardMaterial color={nightVision ? "#060f06" : "#453e34"} roughness={0.95} />
        </mesh>

        {/* 🛣️ THE OUTDOOR ROAD (Highway - widened to 18, lengthened to 120) */}
        {/* Asphalt pavement */}
        <mesh name="road-pavement" rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, 15]}>
          <planeGeometry args={[18, 120]} />
          <meshStandardMaterial color={nightVision ? "#1a1c1a" : "#282a2b"} roughness={0.85} metalness={0.1} />
        </mesh>
        
        {/* Skid marks on the road */}
        {[-10, 15, 40].map((z, idx) => (
          <mesh key={`skid-${idx}`} rotation={[-Math.PI / 2, 0, 0.04]} position={[idx % 2 === 0 ? -1.8 : 2.2, -1.89, z]}>
            <planeGeometry args={[0.32, 6.0]} />
            <meshBasicMaterial color="#111111" transparent opacity={nightVision ? 0.25 : 0.55} />
          </mesh>
        ))}

        {/* Asphalt cracks */}
        {[
          { x: -2, z: 12, rot: 0.8, w: 0.02, l: 3.5 },
          { x: 3, z: -5, rot: -0.5, w: 0.02, l: 4 },
          { x: -4, z: 32, rot: 1.2, w: 0.02, l: 3 },
          { x: 1, z: 50, rot: -0.3, w: 0.02, l: 5 },
        ].map((crack, idx) => (
          <mesh key={`crack-${idx}`} rotation={[-Math.PI / 2, 0, crack.rot]} position={[crack.x, -1.89, crack.z]}>
            <planeGeometry args={[crack.w, crack.l]} />
            <meshBasicMaterial color="#18181a" transparent opacity={nightVision ? 0.35 : 0.65} />
          </mesh>
        ))}

        {/* Yellow center dashed lanes on the sides of Jersey barrier */}
        {[-38, -30, -22, -14, -6, 2, 10, 18, 26, 34, 42, 50, 58, 66, 74].map(z => (
          <group key={z}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.6, -1.88, z]}>
              <planeGeometry args={[0.1, 2.5]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, -1.88, z]}>
              <planeGeometry args={[0.1, 2.5]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
          </group>
        ))}

        {/* White side lane lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8.8, -1.88, 15]}>
          <planeGeometry args={[0.15, 120]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8.8, -1.88, 15]}>
          <planeGeometry args={[0.15, 120]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Concrete Side Guardrails segmented for high fidelity depth */}
        {Array.from({ length: 30 }).map((_, i) => {
          const z = -38 + i * 4.0;
          return (
            <group key={`guard-${i}`}>
              {/* Left shoulder guardrail */}
              <mesh position={[-8.9, -1.0, z]}>
                <boxGeometry args={[0.35, 1.8, 3.8]} />
                <meshStandardMaterial color={nightVision ? "#081008" : "#6c6e70"} roughness={0.9} wireframe={nightVision} />
              </mesh>
              {/* Right shoulder guardrail */}
              <mesh position={[8.9, -1.0, z]}>
                <boxGeometry args={[0.35, 1.8, 3.8]} />
                <meshStandardMaterial color={nightVision ? "#081008" : "#6c6e70"} roughness={0.9} wireframe={nightVision} />
              </mesh>
            </group>
          );
        })}

        {/* Concrete Jersey Barriers down center lane (X = 0) */}
        {Array.from({ length: 18 }).map((_, i) => {
          const z = -2.0 + i * 4.0;
          return <JerseyBarrier key={`jersey-${i}`} position={[0, -1.9, z]} nightVision={nightVision} />;
        })}

        {/* Warning Signboards along shoulders */}
        <MilitarySign 
          position={[-7.8, -1.9, 55]} 
          rotation={[0, 0.2, 0]} 
          title="FORT ZANCUDO" 
          subtitle="MILITARY BASE OUTPOST AHEAD - SPEED LIMIT 15 MPH" 
          nightVision={nightVision} 
        />
        <MilitarySign 
          position={[7.8, -1.9, 20]} 
          rotation={[0, -0.3, 0]} 
          title="WARNING" 
          subtitle="DEADLY FORCE AUTHORIZED - RESTRICTED MILITARY AREA" 
          nightVision={nightVision} 
        />
        <MilitarySign 
          position={[-7.8, -1.9, 6]} 
          rotation={[0, 0.4, 0]} 
          title="RESTRICTED ENTRY" 
          subtitle="IDENTIFICATION CARD AND BIOMETRICS SCAN REQUIRED" 
          nightVision={nightVision} 
        />

        {/* 🌴 Upgraded Stylized 3D Palm Trees (Lining both shoulders) */}
        {[-30, -15, 0, 15, 30, 45, 60, 75].map(z => (
          <group key={z}>
            <PalmTree position={[-8.2, -1.9, z]} nightVision={nightVision} />
            <PalmTree position={[8.2, -1.9, z]} nightVision={nightVision} />
          </group>
        ))}

        {/* 🧱 Upgraded Military Tank Traps */}
        {[-22, -10, 5, 20, 35, 50, 65].map(z => (
          <group key={z}>
            <TankTrap position={[-8.3, -1.9, z]} nightVision={nightVision} />
            <TankTrap position={[8.3, -1.9, z]} nightVision={nightVision} />
          </group>
        ))}

        {/* Streetlight Posts */}
        {[-15, 15, 45, 75].map(z => (
          <group key={z}>
            {/* Left Post */}
            <mesh position={[-8.8, 1.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 6]} />
              <meshStandardMaterial color={nightVision ? "#0c180c" : "#2f3a2f"} wireframe={nightVision} />
            </mesh>
            <mesh position={[-8.5, 4.1, z]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6]} />
              <meshStandardMaterial color={nightVision ? "#0c180c" : "#2f3a2f"} wireframe={nightVision} />
            </mesh>
            <pointLight position={[-8.2, 3.9, z]} color={nightVision ? "#00ff41" : "#ffe8aa"} intensity={nightVision ? 1.2 : 0.8} distance={12} />

            {/* Right Post */}
            <mesh position={[8.8, 1.1, z]}>
              <cylinderGeometry args={[0.08, 0.08, 6]} />
              <meshStandardMaterial color={nightVision ? "#0c180c" : "#2f3a2f"} wireframe={nightVision} />
            </mesh>
            <mesh position={[8.5, 4.1, z]} rotation={[0, 0, -Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, 0.6]} />
              <meshStandardMaterial color={nightVision ? "#0c180c" : "#2f3a2f"} wireframe={nightVision} />
            </mesh>
            <pointLight position={[8.2, 3.9, z]} color={nightVision ? "#00ff41" : "#ffe8aa"} intensity={nightVision ? 1.2 : 0.8} distance={12} />
          </group>
        ))}

        {/* 🗼 Upgraded Searchlight Towers (Grid setup scanning the valley) */}
        <SearchlightTower position={[-9.5, -1.9, 30]} nightVision={nightVision} />
        <SearchlightTower position={[9.5, -1.9, 30]} nightVision={nightVision} />
        <SearchlightTower position={[-9.5, -1.9, 0]} nightVision={nightVision} />
        <SearchlightTower position={[9.5, -1.9, 0]} nightVision={nightVision} />
        <SearchlightTower position={[-9.5, -1.9, -20]} nightVision={nightVision} />
        <SearchlightTower position={[9.5, -1.9, -20]} nightVision={nightVision} />

        {/* 🏢 THE CONCRETE BUNKER FACADE (Entrance Gate) */}
        <group position={[0, 0.1, -2.5]}>
          {/* Left Wall Segment */}
          <mesh position={[-4.5, 1, 0]}>
            <boxGeometry args={[3, 4.2, 0.6]} />
            <meshStandardMaterial color={nightVision ? "#0a140a" : "#4c4f4c"} roughness={0.8} metalness={0.3} wireframe={nightVision} />
          </mesh>
          {/* Right Wall Segment */}
          <mesh position={[4.5, 1, 0]}>
            <boxGeometry args={[3, 4.2, 0.6]} />
            <meshStandardMaterial color={nightVision ? "#0a140a" : "#4c4f4c"} roughness={0.8} metalness={0.3} wireframe={nightVision} />
          </mesh>
          {/* Arch Ceiling Beam */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[6, 0.8, 0.6]} />
            <meshStandardMaterial color={nightVision ? "#0a140a" : "#4c4f4c"} roughness={0.8} metalness={0.3} wireframe={nightVision} />
          </mesh>

          {/* Black/Yellow Hazard Warning Stripes on Arch front face */}
          <group position={[0, 2.7, 0.31]} rotation={[0, 0, 0]}>
            {Array.from({ length: 11 }).map((_, i) => {
              const x = -2.5 + i * 0.5;
              return (
                <mesh key={`hazard-${i}`} position={[x, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                  <planeGeometry args={[0.15, 0.75]} />
                  <meshBasicMaterial color={i % 2 === 0 ? "#ffcc00" : "#111111"} />
                </mesh>
              );
            })}
          </group>

          {/* Razor security wire coils on top of the side walls */}
          <RazorWire position={[-4.5, 3.2, 0]} length={3.0} nightVision={nightVision} />
          <RazorWire position={[4.5, 3.2, 0]} length={3.0} nightVision={nightVision} />

          {/* Overhead spotlights casting real spotlight cones */}
          <OverheadFloodlight position={[-1.8, 2.7, 0.35]} nightVision={nightVision} />
          <OverheadFloodlight position={[1.8, 2.7, 0.35]} nightVision={nightVision} />
        </group>

        {/* 🏢 INSIDE BUNKER CORRIDOR */}
        {/* Hallway Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.9, -17.5]}>
          <planeGeometry args={[10, 30]} />
          <meshStandardMaterial color={nightVision ? "#090b09" : "#1e1e1e"} roughness={0.7} metalness={0.5} />
        </mesh>
        
        {/* Corridor Side Walls */}
        <mesh position={[-5, 1.1, -17.5]}>
          <boxGeometry args={[0.2, 6, 30]} />
          <meshStandardMaterial color={nightVision ? "#061206" : "#2d332d"} wireframe />
        </mesh>
        <mesh position={[5, 1.1, -17.5]}>
          <boxGeometry args={[0.2, 6, 30]} />
          <meshStandardMaterial color={nightVision ? "#061206" : "#2d332d"} wireframe />
        </mesh>

        {/* Ceiling Panels */}
        <mesh position={[0, 4.1, -17.5]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 30]} />
          <meshStandardMaterial color={nightVision ? "#030803" : "#0d120d"} roughness={0.9} />
        </mesh>
        
        {/* Back Wall */}
        <mesh position={[0, 1.1, -32.5]}>
          <boxGeometry args={[10, 6, 0.2]} />
          <meshStandardMaterial color={nightVision ? "#061206" : "#1a1f1a"} wireframe />
        </mesh>

        {/* 🚪 RENDER THE DOORS */}
        {DOORS.map(door => (
          <BunkerDoor 
            key={door.id}
            door={door}
            isNear={activeTerminalId === door.id}
            nightVision={nightVision}
          />
        ))}

        {/* 🎥 Upgraded Orbit Follow Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={12}
          minPolarAngle={0.1}
          maxPolarAngle={1.55}
        />

        {/* HDR Environmental reflections */}
        {!nightVision && <Environment preset="sunset" />}
      </Canvas>
    </div>
  );
}
