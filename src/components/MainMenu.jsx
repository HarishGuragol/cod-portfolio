/* ============================================================
   MainMenu — FULL REDESIGN — Black Ops Warzone Style
   Soldier character, weapon display, cinematic layout
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CONFIG from '../config';
import { playUIHover, playUIClick, playMenuOpen } from '../utils/audio';
import '../styles/menu.css';

const MENU_ITEMS = [
  { id: 'campaign', icon: '🎖️', label: 'Campaign', desc: 'INTEL & DEPLOYMENT HISTORY', key: '1' },
  { id: 'multiplayer', icon: '⚔️', label: 'Multiplayer', desc: 'OPERATIONS & MISSIONS', key: '2' },
  { id: 'armory', icon: '🔫', label: 'Armory', desc: 'WEAPONS & LOADOUT', key: '3' },
  { id: 'barracks', icon: '🏛️', label: 'Barracks', desc: 'TRAINING RECORDS', key: '4' },
  { id: 'comms', icon: '📡', label: 'Comms', desc: 'SECURE CHANNELS', key: '5' },
];

export default function MainMenu({ onSelectSection, audioEnabled, xp = CONFIG.stats.xp, level = CONFIG.stats.level }) {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [embers, setEmbers] = useState([]);
  
  useEffect(() => {
    const emberArr = [];
    for (let i = 0; i < 40; i++) {
      emberArr.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 5 + Math.random() * 10,
        size: 2 + Math.random() * 4,
      });
    }
    setEmbers(emberArr);
    if (audioEnabled) try { playMenuOpen(); } catch(e) {}
  }, []);
  
  useEffect(() => {
    const handleKey = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        if (audioEnabled) try { playUIClick(); } catch(e) {}
        onSelectSection(MENU_ITEMS[num - 1].id);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onSelectSection, audioEnabled]);
  
  const handleHover = (id) => {
    setHoveredItem(id);
    if (audioEnabled) try { playUIHover(); } catch(e) {}
  };
  
  const handleClick = (id) => {
    if (audioEnabled) try { playUIClick(); } catch(e) {}
    onSelectSection(id);
  };
  
  return (
    <motion.div
      className="main-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark overlay with gradient */}
      <div className="menu-overlay" />
      
      {/* Warzone background image */}
      <div className="menu-bg-image" />
      
      {/* Tactical grid */}
      <div className="menu-tactical-grid" />
      
      {/* Floating embers */}
      {embers.map(ember => (
        <div
          key={ember.id}
          className="menu-ember"
          style={{
            left: `${ember.left}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animation: `float-ember ${ember.duration}s ${ember.delay}s infinite linear`,
          }}
        />
      ))}
      
      {/* === LEFT SIDE: Soldier Character === */}
      <motion.div
        className="menu-soldier"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <img src="/images/soldier.png" alt="Operative" className="soldier-image" />
        <div className="soldier-glow" />
      </motion.div>
      
      {/* === CENTER: Title + Nav === */}
      <div className="menu-content">
        {/* Top badge */}
        <motion.div
          className="menu-top-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="badge-line" />
          <span className="badge-text">PORTFOLIO // WARZONE</span>
          <div className="badge-line" />
        </motion.div>
        
        {/* Title */}
        <motion.div
          className="menu-title-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="menu-rank">★ {CONFIG.player.rank} ★</div>
          <h1
            className="menu-callsign glitch-text"
            data-text={CONFIG.player.callsign}
          >
            {CONFIG.player.callsign}
          </h1>
          <p className="menu-title-role">{CONFIG.player.title}</p>
          <p className="menu-title-sub">{CONFIG.player.subtitle}</p>
        </motion.div>
        
        {/* Navigation */}
        <nav className="menu-nav">
          {MENU_ITEMS.map((item, i) => (
            <motion.button
              key={item.id}
              className={`menu-nav-btn ${hoveredItem === item.id ? 'active' : ''}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              onMouseEnter={() => handleHover(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleClick(item.id)}
            >
              <span className="menu-btn-index">{item.key}</span>
              <span className="menu-btn-icon">{item.icon}</span>
              <span className="menu-btn-label">
                {item.label}
                <div className="menu-btn-desc">{item.desc}</div>
              </span>
              <span className="menu-btn-arrow">▸</span>
            </motion.button>
          ))}
        </nav>
      </div>
      
      {/* === RIGHT SIDE: Stats + Weapon === */}
      <motion.div
        className="menu-right-panel"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Level badge */}
        <div className="menu-level-badge">
          <div className="level-label">LEVEL</div>
          <div className="level-number">{level}</div>
          <div className="prestige-label">PRESTIGE {CONFIG.stats.prestige}</div>
          <div className="level-xp-bar">
            <div 
              className="level-xp-fill"
              style={{ width: `${(xp / CONFIG.stats.maxXp) * 100}%` }} 
            />
          </div>
          <div className="level-xp-text">
            {xp.toLocaleString()} / {CONFIG.stats.maxXp.toLocaleString()} XP
          </div>
        </div>

        {/* Stats grid */}
        <div className="menu-stats-grid">
          <div className="stat-item">
            <span className="stat-value">{CONFIG.stats.kd}</span>
            <span className="stat-label">K/D RATIO</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{CONFIG.stats.wins}</span>
            <span className="stat-label">MISSIONS</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{CONFIG.stats.accuracy}</span>
            <span className="stat-label">ACCURACY</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{CONFIG.stats.playtime}</span>
            <span className="stat-label">ACTIVE DUTY</span>
          </div>
        </div>

        {/* Weapon display */}
        <div className="menu-weapon-display">
          <img src="/images/weapon.png" alt="Weapon" className="weapon-image" />
          <div className="weapon-label">CURRENT LOADOUT</div>
        </div>
      </motion.div>
      
      {/* Bottom bar */}
      <div className="menu-bottom-bar">
        <div className="controls">
          <span><kbd>1</kbd>-<kbd>5</kbd> SELECT</span>
          <span><kbd>ESC</kbd> MENU</span>
          <span><kbd>N</kbd> NIGHT VISION</span>
          <span><kbd>M</kbd> AUDIO</span>
        </div>
        <div className="menu-bottom-right-info">
          <span className="menu-realname">{CONFIG.player.realName}</span>
          <span className="menu-separator">|</span>
          <span>{CONFIG.player.location}</span>
          <span className="menu-separator">|</span>
          <span className="menu-online">● ONLINE</span>
        </div>
      </div>
    </motion.div>
  );
}
