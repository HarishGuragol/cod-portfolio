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
    </group>
  );
}

function TankTrap({ position, nightVision }) {
  const color = nightVision ? "#041404" : "#2d2d2d";
  return (
    <group position={position}>
      {/* 3 Crossed metal girders */}
      <mesh rotation={[0.7, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.7} wireframe={nightVision} />
      </mesh>
      <mesh rotation={[-0.7, 0.7, 0]}>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.7} wireframe={nightVision} />
      </mesh>
      <mesh rotation={[0, 0.7, 0.7]}>
        <boxGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.9} metalness={0.7} wireframe={nightVision} />
      </mesh>
      {/* Central joining gusset plate */}
      <mesh position={[0, 0, 0]} rotation={[0, 0.7, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.9} />
      </mesh>
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
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const soldierRef = useRef();
  
  // Starting position: far back on the road at Z = 45 looking towards the bunker
  const playerX = useRef(0);
  const playerZ = useRef(45);
  
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

    const moveSpeed = 6.2 * delta;
    let dx = 0;
    let dz = 0;

    // Keyboard controls override mouse target
    const keyboardMoving = keys.current.w || keys.current.s || keys.current.a || keys.current.d || virtualDir !== '';

    if (keyboardMoving) {
      moveTarget.current = null; // Cancel mouse navigation target
      
      if (keys.current.w || virtualDir === 'UP') {
        dx += camDir.x * moveSpeed;
        dz += camDir.z * moveSpeed;
      }
      if (keys.current.s || virtualDir === 'DOWN') {
        dx -= camDir.x * moveSpeed;
        dz -= camDir.z * moveSpeed;
      }
      if (keys.current.a || virtualDir === 'LEFT') {
        dx -= camRight.x * moveSpeed;
        dz -= camRight.z * moveSpeed;
      }
      if (keys.current.d || virtualDir === 'RIGHT') {
        dx += camRight.x * moveSpeed;
        dz += camRight.z * moveSpeed;
      }
    } else if (moveTarget.current) {
      // Walk towards mouse target
      const target = moveTarget.current;
      const toTarget = new THREE.Vector3(target.x - playerX.current, 0, target.z - playerZ.current);
      const distance = toTarget.length();
      
      if (distance > 0.15) {
        toTarget.normalize();
        dx = toTarget.x * moveSpeed;
        dz = toTarget.z * moveSpeed;
        
        // Prevent overshoot
        if (moveSpeed >= distance) {
          dx = toTarget.x * distance;
          dz = toTarget.z * distance;
          moveTarget.current = null; // Reached!
        }
      } else {
        moveTarget.current = null; // Reached!
      }
    }

    // Update walking indicators
    const isWalking = dx !== 0 || dz !== 0;
    isWalkingRef.current = isWalking;
    if (onUpdateWalking) {
      onUpdateWalking(isWalking);
    }

    // Bounds checking (outdoors allows 8.2 width, interior corridor allows 4.2 width)
    const maxWalkX = playerZ.current <= -2.5 ? 4.2 : 8.2;
    playerX.current = Math.max(-maxWalkX, Math.min(maxWalkX, playerX.current + dx));
    playerZ.current = Math.max(-35, Math.min(70, playerZ.current + dz)); // Z bounds: +70 to -35

    // Eye level follow bob
    const bob = isWalking ? Math.sin(state.clock.elapsedTime * 12) * 0.04 : 0;

    // Rotate soldier character in the direction of movement
    if (isWalking) {
      yaw.current = Math.atan2(dx, dz);
    }

    // Lock OrbitControls target to player coordinates (so camera orbits and follows player)
    if (controlsRef.current) {
      controlsRef.current.target.set(playerX.current, -1.0 + bob, playerZ.current);
    }

    // Update soldier position and rotation (feet stand at ground height of -1.9)
    if (soldierRef.current) {
      soldierRef.current.position.set(playerX.current, -1.9, playerZ.current);
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
        
        {/* Yellow center dashed lanes */}
        {[-38, -30, -22, -14, -6, 2, 10, 18, 26, 34, 42, 50, 58, 66, 74].map(z => (
          <group key={z}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.1, -1.88, z]}>
              <planeGeometry args={[0.1, 2.5]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.1, -1.88, z]}>
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

        {/* Concrete Side Guardrails (Fort Zancudo styling) */}
        <mesh position={[-9, -0.9, 15]}>
          <boxGeometry args={[0.3, 2, 120]} />
          <meshStandardMaterial color={nightVision ? "#081008" : "#7d807d"} roughness={0.9} wireframe={nightVision} />
        </mesh>
        <mesh position={[9, -0.9, 15]}>
          <boxGeometry args={[0.3, 2, 120]} />
          <meshStandardMaterial color={nightVision ? "#081008" : "#7d807d"} roughness={0.9} wireframe={nightVision} />
        </mesh>

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
