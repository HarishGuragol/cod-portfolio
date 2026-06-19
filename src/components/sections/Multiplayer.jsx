/* ============================================================
   Multiplayer — Interactive Mission Operations Lobby
   ============================================================ */
import { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CONFIG from '../../config';
import { playUIHover, playUIClick, playHackingSound } from '../../utils/audio';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Drone Grid Path Coordinates ──────────────────────────────
const DRONE_PATH = [
  { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
  { r: 2, c: 2 }, { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 4, c: 4 }
];
const DRONE_OBSTACLES = [
  { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 2, c: 0 }, { r: 2, c: 1 },
  { r: 2, c: 4 }, { r: 4, c: 1 }, { r: 4, c: 2 }
];

function SonarTerrain3D() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group rotation={[-1.1, 0, 0]} scale={[1.3, 1.3, 1.3]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[2.0, 2.0, 15, 15]} />
        <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.2]}>
        <coneGeometry args={[0.04, 0.35, 4]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ff6a00" />
      </mesh>
      <mesh position={[-0.4, -0.2, 0.15]}>
        <coneGeometry args={[0.04, 0.3, 4]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ff6a00" />
      </mesh>
    </group>
  );
}

export default function Multiplayer({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [selectedOp, setSelectedOp] = useState(CONFIG.projects[0]);
  const [viewedOps, setViewedOps] = useState(new Set([CONFIG.projects[0].name]));
  
  // ── Drone Pathfinding Simulation State ──────────────────────
  const [dronePos, setDronePos] = useState({ r: 0, c: 0 });
  const [isDroneFlying, setIsDroneFlying] = useState(false);
  const [droneLogs, setDroneLogs] = useState([]);

  // ── AI Eye Tracking Simulation State ────────────────────────
  const [lockPos, setLockPos] = useState({ x: 50, y: 50 });
  const [isCalibrating, setIsCalibrating] = useState(false);

  // ── Voice Decryptor State ───────────────────────────────────
  const [activeVoiceCmd, setActiveVoiceCmd] = useState('');
  const [voiceMultiplier, setVoiceMultiplier] = useState(1);

  // ── Generic Decryptor State ─────────────────────────────────
  const [decProgress, setDecProgress] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Hover indicator
  const handleHover = () => {
    if (audioEnabled) try { playUIHover(); } catch(e) {}
  };

  // Select project operation
  const handleSelectOp = (op) => {
    if (audioEnabled) try { playUIClick(); } catch(e) {}
    setSelectedOp(op);
    
    // Track viewed list
    setViewedOps(prev => {
      const next = new Set(prev);
      next.add(op.name);
      if (next.size >= 2 && onCompleteObjective) {
        onCompleteObjective('multiplayer_view_projects');
      }
      return next;
    });

    // Reset simulators
    setIsDroneFlying(false);
    setDronePos({ r: 0, c: 0 });
    setDroneLogs([]);
    setDecProgress(0);
    setIsDecrypting(false);
  };

  // Run Drone Path Simulation
  const runDroneSimulation = () => {
    if (isDroneFlying) return;
    setIsDroneFlying(true);
    setDronePos({ r: 0, c: 0 });
    setDroneLogs(['TAKEOFF: Drone recon unit initiated.', 'GPS LOCK: Coordinates synced.']);

    let pathStep = 0;
    const interval = setInterval(() => {
      pathStep++;
      if (pathStep < DRONE_PATH.length) {
        const nextCell = DRONE_PATH[pathStep];
        setDronePos(nextCell);
        
        if (audioEnabled) {
          try { playHackingSound(); } catch (e) {}
        }

        setDroneLogs(prev => [
          ...prev,
          `NAV: Moving to grid cell [row ${nextCell.r}, col ${nextCell.c}].`,
          ...(DRONE_PATH[pathStep - 1].r !== nextCell.r && DRONE_PATH[pathStep - 1].c !== nextCell.c 
            ? ['CALIB: Adjusting pitch vectors for course correction.'] : [])
        ]);
      } else {
        clearInterval(interval);
        setIsDroneFlying(false);
        setDroneLogs(prev => [
          ...prev,
          'GPS LOCK: Arrived at medical drop beacon.',
          'PAYLOAD: Survey parcel released successfully.',
          'STATUS: MISSION ACCOMPLISHED // RETURN TO BASE.'
        ]);
      }
    }, 450);
  };

  // Calibrate AI Scanner
  const runAICalibration = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    if (audioEnabled) try { playHackingSound(); } catch (e) {}

    setTimeout(() => {
      setIsCalibrating(false);
    }, 1500);
  };

  // AI Lock Movement
  useEffect(() => {
    if (selectedOp.name !== "Eye-Need-A-Break" || isCalibrating) return;
    const interval = setInterval(() => {
      setLockPos({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40
      });
      if (audioEnabled && Math.random() > 0.6) {
        try { playHackingSound(); } catch (e) {}
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [selectedOp.name, isCalibrating, audioEnabled]);

  // Voice Command Click
  const triggerVoiceCommand = (cmd) => {
    if (audioEnabled) try { playHackingSound(); } catch (e) {}
    setActiveVoiceCmd(cmd);
    setVoiceMultiplier(4);
    setTimeout(() => setVoiceMultiplier(1), 1200);
  };

  // Generic Decrypter loop
  const startGenericDecryption = () => {
    if (isDecrypting) return;
    setIsDecrypting(true);
    setDecProgress(0);
    
    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 4;
      setDecProgress(progressVal);
      if (audioEnabled && progressVal % 20 === 0) {
        try { playHackingSound(); } catch(e) {}
      }
      if (progressVal >= 100) {
        clearInterval(interval);
        setIsDecrypting(false);
      }
    }, 80);
  };

  return (
    <motion.div className="multiplayer-layout" variants={fadeUp} initial="initial" animate="animate">
      
      {/* Left Panel: Operation List (Lobby) */}
      <div className="op-lobby-list">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cod-text-dim)', letterSpacing: '2px', marginBottom: '4px' }}>
          AVAILABLE OPERATIONS // SECTORS
        </div>
        {CONFIG.projects.map((op, i) => {
          const isSelected = selectedOp.name === op.name;
          const isScanned = viewedOps.has(op.name);
          return (
            <button
              key={i}
              className={`op-lobby-card military-frame ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectOp(op)}
              onMouseEnter={handleHover}
            >
              <span className="op-status" style={{ color: isSelected ? 'var(--cod-secondary)' : isScanned ? 'var(--cod-primary)' : 'var(--cod-text-muted)' }}>
                {isSelected ? 'ACTIVE' : isScanned ? 'SECURED' : 'LOCKED'}
              </span>
              <span className="op-name" style={{ fontSize: '0.9rem' }}>{op.codename || `OP SECTOR ${i+1}`}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--cod-text-dim)', display: 'block', letterSpacing: '1px', marginTop: '2px' }}>
                {op.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Panel: Interactive Simulator Console */}
      <div className="sim-console-panel military-frame">
        <div className="sim-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 className="sim-title">{selectedOp.name}</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cod-text-muted)', letterSpacing: '1px' }}>
              CODENAME: {selectedOp.codename} &bull; COMPILING ENVIRONMENT
            </span>
          </div>
          <span className="sim-system-badge">SIMULATOR LINK v2.4</span>
        </div>

        <div className="sim-interface">
          {/* Simulator Work Area (Graphic Viewport) */}
          <div className="sim-workarea">
            <div className="sim-grid-lines" />

            {/* 1. Drone Simulator (Rescue Hawk) */}
            {selectedOp.name === "Survey-and-Rescue (eYRC)" && (
              <div className="drone-map-grid">
                {[...Array(5)].map((_, r) =>
                  [...Array(5)].map((_, c) => {
                    const isObstacle = DRONE_OBSTACLES.some(obs => obs.r === r && obs.c === c);
                    const isDrone = dronePos.r === r && dronePos.c === c;
                    const isBeacon = r === 4 && c === 4;
                    const isPassed = DRONE_PATH.some((pt, index) => {
                      const activeIndex = DRONE_PATH.findIndex(p => p.r === dronePos.r && p.c === dronePos.c);
                      return pt.r === r && pt.c === c && index <= activeIndex;
                    });

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`drone-grid-cell ${isObstacle ? 'obstacle' : ''} ${isPassed && !isDrone ? 'path' : ''}`}
                      >
                        {isObstacle && '⚡'}
                        {isBeacon && !isDrone && '🏥'}
                        {isDrone && <span className="drone-icon-sim">🛸</span>}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. Eye Tracker Simulator (Eye-Need-A-Break) */}
            {selectedOp.name === "Eye-Need-A-Break" && (
              <div className="face-mesh-view">
                <div className="face-mesh-grid">
                  <div className="scanning-laser-line" />
                  
                  {/* Focus Locking target */}
                  <div
                    className="focus-lock-box"
                    style={{ left: `${lockPos.x}%`, top: `${lockPos.y}%`, transition: 'all 0.8s ease' }}
                  />
                  
                  {/* Face outline wireframe details */}
                  <div style={{
                    position: 'absolute',
                    top: '40%', left: '30%', width: '12px', height: '12px',
                    border: '1px solid rgba(0, 255, 65, 0.4)', borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '40%', right: '30%', width: '12px', height: '12px',
                    border: '1px solid rgba(0, 255, 65, 0.4)', borderRadius: '50%'
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '25%', left: '42%', width: '30px', height: '8px',
                    border: '1px solid rgba(0, 255, 65, 0.4)', borderRadius: '4px'
                  }} />
                </div>
              </div>
            )}

            {/* 3. Voice Commands Simulator (Project Groot) */}
            {selectedOp.name === "Voice-Controlled Robot" && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 2 }}>
                <div className="voice-waveforms">
                  {[...Array(14)].map((_, idx) => {
                    const baseHeight = 10 + Math.sin(idx * 0.5) * 20 + Math.random() * 15;
                    return (
                      <div
                        key={idx}
                        className="waveform-bar"
                        style={{
                          '--height': `${baseHeight * voiceMultiplier}px`,
                          animationDelay: `${idx * 0.05}s`
                        }}
                      />
                    );
                  })}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: activeVoiceCmd ? 'var(--cod-primary)' : 'var(--cod-text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {activeVoiceCmd ? `ROBOT EXECUTION: [${activeVoiceCmd}]` : 'AWAITING VOICE INPUT BEACON'}
                </div>
              </div>
            )}

            {/* 4. Generic Decryptor Loader (Other projects) */}
            {selectedOp.name !== "Survey-and-Rescue (eYRC)" && 
             selectedOp.name !== "Eye-Need-A-Break" && 
             selectedOp.name !== "Voice-Controlled Robot" && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, fontFamily: 'var(--font-mono)', width: '100%', height: '100%', justifyContent: 'center' }}>
                <div style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden' }}>
                  <Canvas camera={{ position: [0, 0, 1.8], fov: 45 }}>
                    <ambientLight intensity={1.0} />
                    <Suspense fallback={null}>
                      <SonarTerrain3D />
                    </Suspense>
                  </Canvas>
                </div>
                {decProgress > 0 ? (
                  <>
                    <div style={{ fontSize: '0.7rem', color: 'var(--cod-primary)', letterSpacing: '1px', marginBottom: '4px' }}>
                      EXTRACTING REPOSITORY DATA...
                    </div>
                    <div className="scan-progress-bar" style={{ width: '160px' }}>
                      <div className="scan-progress-fill" style={{ width: `${decProgress}%` }} />
                    </div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--cod-text-dim)' }}>
                      DECOMPILING SOURCE PACKS [{decProgress}%]
                    </div>
                  </>
                ) : (
                  <button className="terminal-action-btn" style={{ fontSize: '0.65rem', marginTop: '10px' }} onClick={startGenericDecryption}>
                    DECRYPT REPOSITORY LOGS
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Simulator Logs & Metadata Panel */}
          <div className="sim-logs-panel">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cod-secondary)', letterSpacing: '2px' }}>
              // TACTICAL INTELLIGENCE
            </div>

            {/* Drone Simulator Controls & Logs */}
            {selectedOp.name === "Survey-and-Rescue (eYRC)" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', fontFamily: 'var(--font-mono)' }}>
                <button
                  className="terminal-action-btn"
                  onClick={runDroneSimulation}
                  disabled={isDroneFlying}
                  style={{ fontSize: '0.7rem' }}
                >
                  {isDroneFlying ? '🛰️ DRONE IN FLIGHT...' : '🚀 LAUNCH DRONE SIMULATION'}
                </button>
                
                <div style={{
                  background: 'rgba(2,4,2,0.8)',
                  border: '1px solid var(--cod-border)',
                  padding: '8px',
                  height: '180px',
                  overflowY: 'auto',
                  fontSize: '0.55rem',
                  color: 'var(--cod-primary-glow)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  {droneLogs.length > 0 ? droneLogs.map((log, idx) => (
                    <div key={idx}>&gt;&gt; {log}</div>
                  )) : (
                    <div style={{ color: 'var(--cod-text-dim)' }}>&gt;&gt; SIMULATOR LINK OFFLINE. CLICK DEPLOY.</div>
                  )}
                </div>
              </div>
            )}

            {/* AI surveillance inputs & logs */}
            {selectedOp.name === "Eye-Need-A-Break" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)' }}>
                <button
                  className="terminal-action-btn"
                  onClick={runAICalibration}
                  disabled={isCalibrating}
                  style={{ fontSize: '0.7rem' }}
                >
                  {isCalibrating ? '📡 RUNNING RADAR CALIB...' : '⚙️ CALIBRATE AI SENSORS'}
                </button>
                <div style={{ fontSize: '0.6rem', color: 'var(--cod-text)', lineHeight: '1.5' }}>
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '3px', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--cod-text-dim)' }}>SENSOR STATE:</span> {isCalibrating ? 'TUNING' : 'STABLE'}
                  </div>
                  <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '3px', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--cod-text-dim)' }}>ATTENTION COORD:</span> X: {Math.round(lockPos.x * 3)}, Y: {Math.round(lockPos.y * 3)}
                  </div>
                  <div>
                    <span style={{ color: 'var(--cod-text-dim)' }}>DISTRACTION MATRIX:</span> {isCalibrating ? 'RECALCULATING' : 'ZERO DETECTED'}
                  </div>
                </div>
              </div>
            )}

            {/* Voice Command Button Grid */}
            {selectedOp.name === "Voice-Controlled Robot" && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--cod-text-dim)', letterSpacing: '1px' }}>
                  TRIGGER VOCAL TELEMETRY:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                  <button className="terminal-action-btn" style={{ fontSize: '0.6rem', padding: '6px' }} onClick={() => triggerVoiceCommand('MOVE FORWARD')}>
                    🗣️ "NAVIGATE UNIT FORWARD"
                  </button>
                  <button className="terminal-action-btn" style={{ fontSize: '0.6rem', padding: '6px' }} onClick={() => triggerVoiceCommand('SCAN PERIMETER')}>
                    🗣️ "SCAN LOCAL ENVIRONMENT"
                  </button>
                  <button className="terminal-action-btn" style={{ fontSize: '0.6rem', padding: '6px' }} onClick={() => triggerVoiceCommand('HALT SYSTEM')}>
                    🗣️ "ABORT ALL COMMANDS"
                  </button>
                </div>
              </div>
            )}

            {/* Generic description */}
            {selectedOp.name !== "Survey-and-Rescue (eYRC)" && 
             selectedOp.name !== "Eye-Need-A-Break" && 
             selectedOp.name !== "Voice-Controlled Robot" && (
              <div style={{ fontSize: '0.65rem', color: 'var(--cod-text)', fontFamily: 'var(--font-mono)' }}>
                {decProgress >= 100 ? (
                  <div style={{ color: 'var(--cod-primary)', border: '1px solid var(--cod-primary)', padding: '8px', background: 'rgba(0,255,65,0.05)' }}>
                    [UPLINK SUCCESS] Code details fully decrypted.
                    <br />
                    Difficulty: {selectedOp.difficulty}
                    <br />
                    Status: {selectedOp.status}
                  </div>
                ) : (
                  <div style={{ color: 'var(--cod-text-muted)' }}>
                    Click decrypt to establish satellite uplink to decompile repository parameters.
                  </div>
                )}
              </div>
            )}

            {/* Core project features list (Always shown) */}
            <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--cod-border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--cod-text-dim)', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                SPECIFICATIONS:
              </span>
              <ul className="sim-spec-list">
                {selectedOp.tech.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <a href={selectedOp.link} className="project-link" style={{ fontSize: '0.55rem', padding: '4px 8px', margin: 0 }} target="_blank" rel="noopener noreferrer">
                  DEPLOY
                </a>
                <a href={selectedOp.github} className="project-link" style={{ fontSize: '0.55rem', padding: '4px 8px', margin: 0 }} target="_blank" rel="noopener noreferrer">
                  SOURCE
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
      
    </motion.div>
  );
}
