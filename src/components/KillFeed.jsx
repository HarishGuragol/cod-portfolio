/* ============================================================
   KillFeed — Skill/achievement notification system
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../config';
import { playKillFeedSound } from '../utils/audio';

const ACTIONS = [
  'eliminated',
  'dominated',
  'mastered',
  'deployed',
  'conquered',
  'unlocked',
];

export default function KillFeed({ audioEnabled, isActive }) {
  const [items, setItems] = useState([]);
  const indexRef = useRef(0);
  const idCounter = useRef(0);
  
  useEffect(() => {
    if (!isActive) return;
    
    const addKill = () => {
      const skill = CONFIG.skills[indexRef.current % CONFIG.skills.length];
      const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      
      const newItem = {
        id: idCounter.current++,
        player: CONFIG.player.callsign,
        action,
        target: skill.name,
        icon: skill.icon,
      };
      
      setItems(prev => {
        const updated = [newItem, ...prev];
        return updated.slice(0, 5); // Max 5 visible
      });
      
      if (audioEnabled) {
        try { playKillFeedSound(); } catch(e) {}
      }
      
      indexRef.current++;
    };
    
    // Add first kill after a short delay
    const initTimer = setTimeout(addKill, 1500);
    
    // Continue adding kills
    const interval = setInterval(addKill, 4000);
    
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [isActive, audioEnabled]);
  
  // Auto-remove items after 6 seconds
  useEffect(() => {
    if (items.length === 0) return;
    
    const timer = setTimeout(() => {
      setItems(prev => prev.slice(0, -1));
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [items]);
  
  return (
    <div className="hud-killfeed">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="killfeed-item"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span className="player-name">{item.player}</span>
            <span className="action">{item.action}</span>
            <span className="weapon-icon">{item.icon}</span>
            <span className="target">{item.target}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
