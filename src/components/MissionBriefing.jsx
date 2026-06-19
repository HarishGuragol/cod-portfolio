/* ============================================================
   MissionBriefing — Cinematic Level Loading Screen
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { playTypingBriefing } from '../utils/audio';
import '../styles/effects.css';

const BRIEFINGS = {
  campaign: {
    op: 'OPERATION FORTRESS',
    loc: 'BANGALORE HQ // SECURE COMPARTMENT',
    date: '19 JUN 2026 // 2357 HOURS',
    obj: 'INFILTRATE CLASSIFIED FILES AND RETRIEVE EXPERIMENTAL OPERATIVE PROFILE & DEPLOYMENT HISTORY.',
    bg: '/images/tactical-bg.png'
  },
  multiplayer: {
    op: 'OPERATION INTEL STORM',
    loc: 'CLOUD ARSENAL // GATEWAY 141',
    date: '19 JUN 2026 // 2358 HOURS',
    obj: 'SECURE OPERATIONAL SPECIFICATIONS FOR MULTIPLE RECONNAISSANCE SYSTEMS AND ASSAULT CODEBASES.',
    bg: '/images/warzone.png'
  },
  armory: {
    op: 'OPERATION GUNSMITH',
    loc: 'ARMORY SUB-LEVEL 3 // CACHE',
    date: '19 JUN 2026 // 2359 HOURS',
    obj: 'EQUIP SYSTEM CAPABILITIES, ADJUST LOADOUT CALIBRATIONS, AND PREPARE SKILL ARSENAL FOR DEPLOYMENT.',
    bg: '/images/weapon.png'
  },
  barracks: {
    op: 'OPERATION TRAINING FILE',
    loc: 'WEST POINT ACADEMY ARCHIVE',
    date: '20 JUN 2026 // 0000 HOURS',
    obj: 'AUTHENTICATE SPECIALIST CERTIFICATIONS AND RETRIEVE ACADEMIC RECORDS FOR EVALUATION.',
    bg: '/images/tactical-bg.png'
  },
  comms: {
    op: 'OPERATION SECURE UPLINK',
    loc: 'COMMS RADAR STATION // BUNKER 9',
    date: '20 JUN 2026 // 0001 HOURS',
    obj: 'ESTABLISH SECURE END-TO-END DATA UPLINK CHANNEL TO TRANSMIT HIGH-PRIORITY LOGISTICS ENVELOPE TO HQ.',
    bg: '/images/warzone.png'
  }
};

export default function MissionBriefing({ sectionId, onComplete, audioEnabled }) {
  const data = BRIEFINGS[sectionId] || BRIEFINGS.campaign;
  const [typedObj, setTypedObj] = useState('');
  const [progress, setProgress] = useState(0);
  const audioTimer = useRef(null);

  // Typewriter objective text
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < data.obj.length) {
        setTypedObj(prev => prev + data.obj.charAt(index));
        index++;
        
        // Play typing audio chirp at intervals to avoid audio context overload
        if (audioEnabled && index % 2 === 0) {
          try { playTypingBriefing(); } catch (e) {}
        }
      } else {
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [data.obj, audioEnabled]);

  // Fill progress bar and trigger completion
  useEffect(() => {
    const duration = 2400; // 2.4s loading
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let step = 0;

    const progressInterval = setInterval(() => {
      step++;
      const currentProgress = Math.min((step / steps) * 100, 100);
      setProgress(currentProgress);

      if (step >= steps) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onComplete();
        }, 200);
      }
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <motion.div
      className="mission-briefing"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background with slight zoom */}
      <div
        className="mission-briefing-bg"
        style={{ backgroundImage: `url(${data.bg})` }}
      />
      <div className="mission-briefing-overlay" />

      {/* Content */}
      <div className="mission-briefing-content">
        <motion.div
          className="briefing-classification"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ▲ CLASSIFIED // EYES ONLY ▲
        </motion.div>
        
        <motion.div
          className="briefing-date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
        >
          {data.date}
        </motion.div>
        
        <motion.div
          className="briefing-location"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4 }}
        >
          {data.loc}
        </motion.div>

        <motion.h2
          className="briefing-operation"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 80 }}
        >
          {data.op}
        </motion.h2>

        <div className="briefing-objective">
          <span className="objective-label">PRIMARY OBJECTIVE: </span>
          <span>{typedObj}</span>
          <span className="blinking-cursor">_</span>
        </div>
      </div>

      {/* Loading Progress Bar */}
      <div className="briefing-progress">
        <div className="briefing-progress-bar">
          <div className="briefing-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="briefing-loading-text">
          ESTABLISHING DATA CONNECTION... {Math.round(progress)}%
        </div>
      </div>
    </motion.div>
  );
}
