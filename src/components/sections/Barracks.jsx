/* ============================================================
   Barracks — Trooper Combat Record & Medal Showcase
   ============================================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../config';
import { playUIHover } from '../../utils/audio';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MEDALS = [
  {
    idx: 0,
    icon: '🥇',
    name: 'TensorFlow Developer',
    year: '2023',
    op: 'OPERATION NEURAL DEFENSE',
    desc: 'Awarded for proficiency in compiling deep learning models, training neural network classifiers, and deploying computer vision intelligence pipelines in the field.'
  },
  {
    idx: 1,
    icon: '🥈',
    name: 'Flutter Specialist',
    year: '2022',
    op: 'OPERATION RAPID DEPLOY',
    desc: 'Awarded for outstanding speed in compiling cross-platform codebase frameworks and deploying native mobile platforms on Android and iOS battlefronts.'
  },
  {
    idx: 2,
    icon: '🥉',
    name: 'Python ML Specialist',
    year: '2022',
    op: 'OPERATION DATA PREDICTION',
    desc: 'Awarded for excellence in scripting algorithmic predictions, cleaning unstructured datasets, and executing regression models.'
  },
  {
    idx: 3,
    icon: '🏆',
    name: 'AWS Cloud Practitioner',
    year: '2023',
    op: 'OPERATION NEBULOUS UPLINK',
    desc: 'Awarded for successful deployment and architecture configurations of secure cloud data systems and VPC network infrastructure.'
  }
];

export default function Barracks({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [visitedMedals, setVisitedMedals] = useState(new Set());

  // Extract OCS details from config
  const ocsData = CONFIG.education.find(edu => edu.degree) || {
    program: 'CADET DIVISION',
    degree: 'B.E. CSE',
    field: 'Computer Science',
    institution: 'Bangalore University',
    period: '2019 — 2023',
    gpa: 'Distinction'
  };

  const handleMedalHover = (medal) => {
    if (audioEnabled) {
      try { playUIHover(); } catch (e) {}
    }
    setSelectedMedal(medal);

    // Track visited medals to trigger objective complete
    setVisitedMedals(prev => {
      const next = new Set(prev);
      next.add(medal.idx);
      if (next.size >= 2 && onCompleteObjective) {
        onCompleteObjective('barracks_inspect_certs');
      }
      return next;
    });
  };

  return (
    <motion.div className="barracks-layout" variants={fadeUp} initial="initial" animate="animate">
      
      {/* Left Panel: Trooper Combat Record & OCS Files */}
      <div className="trooper-profile-card military-frame">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cod-secondary)', letterSpacing: '2px' }}>
          TROOPER PROFILE // COMBAT RECORD
        </div>
        
        {/* Soldier Calling Card Banner */}
        <div className="trooper-callingcard">
          <div className="callingcard-glitch-grid" />
          <div className="callingcard-name">{CONFIG.player.callsign}</div>
        </div>

        {/* Stats Grid */}
        <div className="trooper-stats-summary">
          <div className="trooper-stat-row">
            <span className="label">CALL SIGN</span>
            <span className="value" style={{ color: 'var(--cod-primary)' }}>{CONFIG.player.callsign}</span>
          </div>
          <div className="trooper-stat-row">
            <span className="label">MILITARY RANK</span>
            <span className="value">{CONFIG.player.rank}</span>
          </div>
          <div className="trooper-stat-row">
            <span className="label">WEAPON K/D</span>
            <span className="value" style={{ color: 'var(--cod-primary)' }}>{CONFIG.stats.kd}</span>
          </div>
          <div className="trooper-stat-row">
            <span className="label">MISSIONS WON</span>
            <span className="value">{CONFIG.stats.wins}</span>
          </div>
          <div className="trooper-stat-row">
            <span className="label">SCAN ACCURACY</span>
            <span className="value">{CONFIG.stats.accuracy}</span>
          </div>
        </div>

        {/* OCS (Education) Records */}
        <div style={{
          borderTop: '1px solid var(--cod-border)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ fontSize: '0.55rem', color: 'var(--cod-warning)', letterSpacing: '1px' }}>
            // OFFICERS SCHOOL ACADEMY RECORD:
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--cod-text-bright)', fontWeight: 'bold' }}>
            {ocsData.degree} ({ocsData.field})
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--cod-text)' }}>
            {ocsData.institution}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--cod-text-dim)' }}>
            <span>PERIOD: {ocsData.period}</span>
            <span>GRADE: {ocsData.gpa}</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Trophy Cabinet Medals Rack */}
      <div className="trophy-cabinet military-frame">
        <h3 className="trophy-cabinet-title">
          Specialist Achievements
          <span style={{ fontSize: '0.55rem', color: 'var(--cod-text-muted)', marginLeft: '12px', fontFamily: 'var(--font-mono)' }}>
            // ({visitedMedals.size} / {MEDALS.length} MEDALS EXAMINED)
          </span>
        </h3>

        <div className="medals-grid">
          {MEDALS.map(medal => {
            const isScanned = visitedMedals.has(medal.idx);
            const isSelected = selectedMedal?.idx === medal.idx;
            return (
              <div
                key={medal.idx}
                className="medal-slot"
                onMouseEnter={() => handleMedalHover(medal)}
                style={{
                  borderColor: isSelected ? 'var(--cod-warning)' : isScanned ? 'var(--cod-primary)' : 'var(--cod-border)',
                  background: isSelected ? 'rgba(255, 170, 0, 0.05)' : isScanned ? 'rgba(0, 255, 65, 0.02)' : 'rgba(2,4,2,0.85)'
                }}
              >
                <div className="medal-icon-big">{medal.icon}</div>
                <div className="medal-slot-title">{medal.name.split(' ')[0]}</div>
                {isScanned && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    fontSize: '0.45rem',
                    color: 'var(--cod-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    [✓]
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Medal Detail Overlay */}
        <div style={{ minHeight: '110px', display: 'flex', flexDirection: 'column' }}>
          {selectedMedal ? (
            <div className="medal-detail-overlay">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="medal-detail-title">{selectedMedal.name}</div>
                <span style={{ fontSize: '0.55rem', color: 'var(--cod-text-dim)' }}>
                  {selectedMedal.op} &bull; EARNED: {selectedMedal.year}
                </span>
              </div>
              <p className="medal-detail-desc" style={{ marginTop: '6px' }}>
                {selectedMedal.desc}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--cod-text-dim)',
              textAlign: 'center',
              borderTop: '1px dashed rgba(255,255,255,0.1)',
              paddingTop: '20px'
            }}>
              Hover over an achievement medal slot in the trophy cabinet to scan operations telemetry dossiers.
              <br />
              (Scan at least 2 to satisfy credentials verification)
            </div>
          )}
        </div>
      </div>
      
    </motion.div>
  );
}
