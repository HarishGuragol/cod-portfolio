/* ============================================================
   BootScreen — Cinematic military startup sequence
   ============================================================ */
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../config';
import { playBootBeep, resumeAudio } from '../utils/audio';
import '../styles/boot.css';

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Generate timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toISOString().slice(11, 23);
  };
  
  // Boot sequence
  useEffect(() => {
    const messages = CONFIG.bootMessages;
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < messages.length) {
        setLines(prev => [...prev, {
          text: messages[currentLine],
          timestamp: getTimestamp(),
          id: currentLine,
        }]);
        setProgress(((currentLine + 1) / messages.length) * 100);
        
        if (CONFIG.audio.enabled) {
          try { playBootBeep(); } catch(e) {}
        }
        
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowPrompt(true), 500);
      }
    }, 350);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle start
  const handleStart = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    resumeAudio();
    
    setTimeout(() => {
      onComplete();
    }, 600);
  }, [onComplete, isExiting]);
  
  // Auto-skip after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isExiting) {
        handleStart();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [handleStart, isExiting]);
  
  // Keyboard / click to skip
  useEffect(() => {
    const handleKey = (e) => {
      if (showPrompt) handleStart();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showPrompt, handleStart]);
  
  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          className="boot-screen crt-flicker"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={showPrompt ? handleStart : undefined}
        >
          {/* Corner decorations */}
          <div className="boot-corner top-left" />
          <div className="boot-corner top-right" />
          <div className="boot-corner bottom-left" />
          <div className="boot-corner bottom-right" />
          
          {/* Terminal output */}
          <div className="boot-terminal">
            {lines.map((line, i) => (
              <motion.div
                key={line.id}
                className="boot-line"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.7, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="timestamp">[{line.timestamp}]</span>
                <span className="prefix">{'>'}</span>
                <span>{line.text}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Center content */}
          <div className="boot-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1
                className="boot-title glitch-text"
                data-text={CONFIG.player.callsign}
              >
                {CONFIG.player.callsign}
              </h1>
              <p className="boot-subtitle">{CONFIG.player.title}</p>
            </motion.div>
            
            {/* Press Start */}
            {showPrompt && (
              <motion.div
                className="boot-prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                PRESS START TO DEPLOY
              </motion.div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="boot-progress-container">
            <div className="boot-progress-label">
              <span>LOADING SYSTEMS</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="boot-progress-bar">
              <div
                className="boot-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Footer info */}
          <div className="boot-version">
            PORTFOLIO v2.0.0 // BUILD {new Date().toISOString().slice(0, 10).replace(/-/g, '')}
          </div>
          <div className="boot-classification">
            ▮ CLASSIFIED ▮
          </div>
        </motion.div>
      ) : (
        /* Flash effect on exit */
        <motion.div
          className="section-flash"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
}
