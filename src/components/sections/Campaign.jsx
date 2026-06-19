/* ============================================================
   Campaign — About Me / Classified Dossier + Experience
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CONFIG from '../../config';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Campaign({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [visitedTimeline, setVisitedTimeline] = useState(new Set());

  // Trigger dossier objective complete after 1.5s reading time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCompleteObjective) {
        onCompleteObjective('campaign_read_dossier');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [onCompleteObjective]);

  const handleTimelineHover = (index) => {
    setVisitedTimeline(prev => {
      const next = new Set(prev);
      next.add(index);
      if (next.size === CONFIG.experience.length && onCompleteObjective) {
        onCompleteObjective('campaign_explore_timeline');
      }
      return next;
    });
  };

  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      {/* Dossier */}
      <motion.div className="dossier military-frame classified-stamp" variants={fadeUp}>
        <div className="dossier-header">
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
              <span className="field-label">Specialization:</span>
              <span className="field-value highlight">{CONFIG.player.title}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Location:</span>
              <span className="field-value">{CONFIG.player.location}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">K/D Ratio:</span>
              <span className="field-value highlight">{CONFIG.stats.kd}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Missions Won:</span>
              <span className="field-value">{CONFIG.stats.wins}</span>
            </div>
            <div className="dossier-field">
              <span className="field-label">Active Duty:</span>
              <span className="field-value">{CONFIG.stats.playtime}</span>
            </div>
          </div>
        </div>
        
        <div className="dossier-bio">
          <div className="bio-label">█ OPERATIVE BRIEFING</div>
          <p className="bio-text">{CONFIG.player.bio}</p>
        </div>
      </motion.div>
      
      {/* Experience Timeline */}
      <motion.div className="experience-timeline" variants={fadeUp}>
        <div className="section-header" style={{ marginTop: '48px' }}>
          <div className="section-tag">// DEPLOYMENT HISTORY</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            Field Operations
            <span style={{ fontSize: '0.6rem', color: 'var(--cod-secondary)', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>
              ({visitedTimeline.size} / {CONFIG.experience.length} LOGS RETRIEVED)
            </span>
          </h2>
        </div>
        
        {CONFIG.experience.map((exp, i) => (
          <motion.div
            key={i}
            className={`timeline-item ${visitedTimeline.has(i) ? 'intel-scanned' : ''}`}
            variants={fadeUp}
            onMouseEnter={() => handleTimelineHover(i)}
            style={{
              borderLeftColor: visitedTimeline.has(i) ? 'var(--cod-secondary)' : 'var(--cod-primary)',
              transition: 'border-left-color 0.4s ease'
            }}
          >
            <div className="timeline-operation" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{exp.operation}</span>
              {visitedTimeline.has(i) && <span style={{ color: 'var(--cod-secondary)' }}>[SCAN COMPLETE]</span>}
            </div>
            <h3 className="timeline-role">{exp.role}</h3>
            <p className="timeline-company">{exp.company} — {exp.location}</p>
            <div className="timeline-period">{exp.period}</div>
            <p className="timeline-description">{exp.description}</p>
            <ul className="timeline-highlights">
              {exp.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
