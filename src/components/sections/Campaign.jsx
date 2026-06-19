/* ============================================================
   Campaign — Interactive Sonar Radar Recon
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../config';
import { playUIHover, playUIClick } from '../../utils/audio';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const RADAR_TARGETS = [
  {
    idx: 0,
    label: 'SECTOR ALPHA: IIT BOMBAY',
    coords: { x: '35%', top: '30%' },
    operation: 'OPERATION eYRC',
    role: 'Robotics Engineer',
    company: 'e-Yantra Robotics (IIT Bombay)',
    location: 'India',
    period: '2021 — 2022',
    description: 'Deployed in high-stakes national robotics competition. Engineered pathfinding modules and autonomous drone systems under tight constraints.',
    highlights: [
      'Programmed drone navigation controls for disaster survey.',
      'Constructed computer vision segmentation for survivor beacon isolation.',
      'Collaborated on multi-disciplinary embedded hardware systems.'
    ]
  },
  {
    idx: 1,
    label: 'SECTOR BETA: STARTUP OPS',
    coords: { x: '75%', top: '48%' },
    operation: 'OPERATION STARTUP',
    role: 'Cross-Platform Developer',
    company: 'Fintech Startup',
    location: 'Bangalore, India',
    period: '2022 — 2023',
    description: 'Frontline mobile and web deployment at high-velocity fintech startup. Developed production-grade applications using Flutter and ReactJS.',
    highlights: [
      'Built native cross-platform payment/dashboard apps.',
      'Optimized client-side rendering speeds by 30%.',
      'Configured Firebase real-time database gateways.'
    ]
  },
  {
    idx: 2,
    label: 'SECTOR GAMMA: FREELANCE HQ',
    coords: { x: '50%', top: '75%' },
    operation: 'OPERATION FREELANCE',
    role: 'Freelance Lead Dev',
    company: 'Upwork & Independent Contracts',
    location: 'Remote // Worldwide',
    period: '2023 — Present',
    description: 'Running independent black-ops contracts. Delivering precision React frontends, Flutter mobile apps, and machine learning scripts.',
    highlights: [
      'Delivered 15+ complex client deployments globally.',
      'Authored tech documentation & articles on Medium (5k+ readers).',
      'Developed custom Python ML intelligence filters.'
    ]
  }
];

export default function Campaign({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [activeTarget, setActiveTarget] = useState(null);
  const [scannedSet, setScannedSet] = useState(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Trigger dossier objective complete after 1.5s reading time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCompleteObjective) {
        onCompleteObjective('campaign_read_dossier');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [onCompleteObjective]);

  const handleTargetClick = (target) => {
    if (audioEnabled) {
      try { playUIClick(); } catch (e) {}
    }
    
    setIsScanning(true);
    setScanProgress(0);
    setActiveTarget(target);

    // Simulate satellite scanner
    let step = 0;
    const interval = setInterval(() => {
      step += 5;
      setScanProgress(step);
      if (step >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        
        // Mark target as scanned
        setScannedSet(prev => {
          const next = new Set(prev);
          next.add(target.idx);
          
          // If all 3 targets are scanned, complete the objective!
          if (next.size === RADAR_TARGETS.length && onCompleteObjective) {
            onCompleteObjective('campaign_explore_timeline');
          }
          return next;
        });
      }
    }, 40); // 0.8s scanning sequence
  };

  const handleHover = () => {
    if (audioEnabled) {
      try { playUIHover(); } catch (e) {}
    }
  };

  return (
    <motion.div variants={fadeUp} initial="initial" animate="animate">
      <div className="dossier military-frame classified-stamp" style={{ marginBottom: '20px' }}>
        <div className="dossier-header" style={{ borderBottom: '1px solid var(--cod-border)', paddingBottom: '16px' }}>
          <div className="dossier-photo">
            <span className="photo-placeholder">👤</span>
          </div>
          <div className="dossier-details">
            <div className="dossier-field">
              <span className="field-label">Callsign:</span>
              <span className="field-value highlight">{CONFIG.player.callsign}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Real Name:</span>
              <span className="field-value">{CONFIG.player.realName}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Rank:</span>
              <span className="field-value">{CONFIG.player.rank}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Primary Spec:</span>
              <span className="field-value highlight">{CONFIG.player.title}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Operating Location:</span>
              <span className="field-value">{CONFIG.player.location}</span>
            </div>
          </div>
        </div>
        
        <div className="dossier-bio" style={{ marginTop: '12px', borderTop: 'none', paddingTop: 0 }}>
          <div className="bio-label">█ CLASSIFIED SATELLITE BRIEFING</div>
          <p className="bio-text" style={{ fontSize: '0.85rem' }}>{CONFIG.player.bio}</p>
        </div>
      </div>

      {/* Campaign Layout: Radar Scan Console + side details */}
      <div className="campaign-layout">
        {/* Left: Interactive Sonar Radar Sweeper */}
        <div className="radar-console military-frame">
          <div className="radar-screen">
            <div className="radar-sweep" />
            <div className="radar-ring-1" />
            <div className="radar-ring-2" />
            <div className="radar-crosshair-h" />
            <div className="radar-crosshair-v" />
            
            {/* Blinking Targets */}
            {RADAR_TARGETS.map(target => {
              const isActive = activeTarget?.idx === target.idx;
              const isScanned = scannedSet.has(target.idx);
              return (
                <div
                  key={target.idx}
                  className={`radar-dot-target ${isActive ? 'active' : ''}`}
                  style={{ left: target.coords.x, top: target.coords.top }}
                  onClick={() => handleTargetClick(target)}
                  onMouseEnter={handleHover}
                >
                  <div className="radar-dot-label">
                    {target.operation} {isScanned ? '✓' : '●'}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'var(--cod-primary)',
            letterSpacing: '1px'
          }}>
            [ sonar recon: scan red indicators ]
          </div>
        </div>

        {/* Right: Intel Side Decryptor Panel */}
        <div className="campaign-intel-panel military-frame">
          {activeTarget ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="intel-header">
                <div className="intel-op">{activeTarget.operation} // DECRYPTED LOGS</div>
                <h3 className="intel-title">{activeTarget.role}</h3>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--cod-text-muted)',
                  marginTop: '4px'
                }}>
                  {activeTarget.company} &bull; {activeTarget.location} &bull; {activeTarget.period}
                </div>
              </div>

              {isScanning ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  fontFamily: 'var(--font-mono)'
                }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--cod-primary)' }}>🛰️</div>
                  <div style={{ color: 'var(--cod-primary)', fontSize: '0.7rem', letterSpacing: '2px' }}>
                    RUNNING SAT-DECRYPT PROTOCOL...
                  </div>
                  <div className="scan-progress-bar" style={{ width: '200px' }}>
                    <div className="scan-progress-fill" style={{ width: `${scanProgress}%` }} />
                  </div>
                  <div style={{ color: 'var(--cod-text-dim)', fontSize: '0.6rem' }}>
                    ESTABLISHING DOWNLINK CONNECTION [{scanProgress}%]
                  </div>
                </div>
              ) : (
                <div className="intel-body">
                  <p style={{ marginBottom: '16px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {activeTarget.description}
                  </p>
                  
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cod-secondary)', letterSpacing: '2px', marginBottom: '8px' }}>
                    // LOGGED INFILTRATION KEYPOINTS:
                  </div>
                  <ul className="timeline-highlights">
                    {activeTarget.highlights.map((h, k) => (
                      <li key={k} style={{ fontSize: '0.75rem', marginBottom: '4px' }}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
              color: 'var(--cod-text-dim)',
              padding: '20px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📡</div>
              <h3 style={{ fontSize: '1rem', color: 'var(--cod-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Satellite Scan Link Offline
              </h3>
              <p style={{ fontSize: '0.7rem', marginTop: '8px', lineHeight: '1.6' }}>
                Launch coordinate sonar scans from the radar console on the left to extract tactical career intelligence folders.
                <br />
                ({scannedSet.size} / {RADAR_TARGETS.length} regions captured)
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
