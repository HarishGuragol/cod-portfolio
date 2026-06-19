/* ============================================================
   HUD — Tactical Heads-Up Display Overlay
   ============================================================ */
import { useState, useEffect } from 'react';
import CONFIG from '../config';
import KillFeed from './KillFeed';
import '../styles/hud.css';

const SECTIONS = ['campaign', 'multiplayer', 'armory', 'barracks', 'comms'];
const SECTION_NAMES = {
  campaign: 'CAMPAIGN',
  multiplayer: 'MULTIPLAYER',
  armory: 'ARMORY',
  barracks: 'BARRACKS',
  comms: 'COMMS',
};

const COMPASS_DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const SECTION_OBJECTIVES = {
  campaign: [
    { id: 'campaign_read_dossier', text: 'EXPLORE OPERATIVE BIOGRAPHY' },
    { id: 'campaign_explore_timeline', text: 'INSPECT DEPLOYMENT LOGS' },
  ],
  multiplayer: [
    { id: 'multiplayer_view_projects', text: 'INSPECT PROJECT Blueprints' },
  ],
  armory: [
    { id: 'armory_equip_weapon', text: 'EQUIP PRIMARY WEAPON CACHE' },
  ],
  barracks: [
    { id: 'barracks_inspect_certs', text: 'VERIFY EDUCATION & BADGES' },
  ],
  comms: [
    { id: 'comms_secure_uplink', text: 'TRANSMIT SECURE DATA UPLINK' },
  ]
};

export default function HUD({
  currentSection,
  audioEnabled,
  onToggleAudio,
  nightVision,
  onToggleNightVision,
  onBackToMenu,
  xp,
  level,
  completedObjectives = [],
  levelUpAlert = false,
}) {
  const [health, setHealth] = useState(100);
  const sectionIndex = SECTIONS.indexOf(currentSection);
  const totalSections = SECTIONS.length;
  
  // Simulate health based on interaction time (just for fun)
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => {
        const newHealth = prev - Math.random() * 2;
        if (newHealth <= 20) return 100; // "Regenerate"
        return newHealth;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const healthClass = health > 60 ? '' : health > 30 ? 'medium' : 'low';
  
  // XP progress
  const xpPercent = (xp / CONFIG.stats.maxXp) * 100;
  
  // Compass direction based on section
  const compassDir = COMPASS_DIRS[sectionIndex >= 0 ? sectionIndex % COMPASS_DIRS.length : 0];
  
  const objectives = SECTION_OBJECTIVES[currentSection] || [];
  
  return (
    <div className="hud-overlay">
      {/* Level Up Flashing Notification Banner */}
      {levelUpAlert && (
        <div className="hud-level-up-banner crt-flicker">
          <h1 className="level-up-title">★ LEVEL UP ★</h1>
          <div className="level-up-sub">OPERATIVE PROMOTED TO LEVEL {level}</div>
        </div>
      )}

      {/* ESC hint */}
      <div className="hud-esc-hint">
        <kbd>ESC</kbd> MENU &nbsp; <kbd>N</kbd> NV
      </div>
      
      {/* Audio Toggle */}
      <button
        className={`hud-audio-toggle ${!audioEnabled ? 'muted' : ''}`}
        onClick={onToggleAudio}
        id="audio-toggle"
      >
        {audioEnabled ? '🔊' : '🔇'}
        <span>{audioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
      </button>
      
      {/* Night Vision Toggle */}
      <button
        className={`hud-nv-toggle ${nightVision ? 'active' : ''}`}
        onClick={onToggleNightVision}
        id="nv-toggle"
      >
        {nightVision ? '🟢' : '⚫'}
        <span>NV {nightVision ? 'ON' : 'OFF'}</span>
      </button>
      
      {/* HUD Active Objectives Checklist Panel (Left Side) */}
      {currentSection ? (
        objectives.length > 0 && (
          <div className="hud-objectives crt-flicker">
            <div className="hud-objectives-header">
              <span>OBJECTIVES</span>
              <span>
                {objectives.filter(obj => completedObjectives.includes(obj.id)).length} / {objectives.length}
              </span>
            </div>
            <div className="objectives-list">
              {objectives.map(obj => {
                const isDone = completedObjectives.includes(obj.id);
                return (
                  <div key={obj.id} className={`objective-item ${isDone ? 'completed' : ''}`}>
                    <span className="objective-checkbox" />
                    <span>{obj.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        <div className="hud-objectives crt-flicker">
          <div className="hud-objectives-header">
            <span>BUNKER DEPLOYMENT</span>
            <span>
              {[
                completedObjectives.includes('campaign_read_dossier') || completedObjectives.includes('campaign_explore_timeline'),
                completedObjectives.includes('multiplayer_view_projects'),
                completedObjectives.includes('armory_equip_weapon'),
                completedObjectives.includes('barracks_inspect_certs'),
                completedObjectives.includes('comms_secure_uplink')
              ].filter(Boolean).length} / 5
            </span>
          </div>
          <div className="objectives-list">
            <div className={`objective-item ${completedObjectives.includes('campaign_read_dossier') || completedObjectives.includes('campaign_explore_timeline') ? 'completed' : ''}`}>
              <span className="objective-checkbox" />
              <span>OPEN CAMPAIGN DOOR</span>
            </div>
            <div className={`objective-item ${completedObjectives.includes('multiplayer_view_projects') ? 'completed' : ''}`}>
              <span className="objective-checkbox" />
              <span>OPEN MULTIPLAYER DOOR</span>
            </div>
            <div className={`objective-item ${completedObjectives.includes('armory_equip_weapon') ? 'completed' : ''}`}>
              <span className="objective-checkbox" />
              <span>OPEN ARMORY DOOR</span>
            </div>
            <div className={`objective-item ${completedObjectives.includes('barracks_inspect_certs') ? 'completed' : ''}`}>
              <span className="objective-checkbox" />
              <span>OPEN BARRACKS DOOR</span>
            </div>
            <div className={`objective-item ${completedObjectives.includes('comms_secure_uplink') ? 'completed' : ''}`}>
              <span className="objective-checkbox" />
              <span>OPEN COMMS DOOR</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Compass */}
      <div className="hud-top-bar">
        <div className="hud-compass">
          {COMPASS_DIRS.map((dir, i) => (
            <span
              key={dir}
              className={dir === compassDir ? 'active-direction' : 'direction'}
            >
              {dir}
            </span>
          ))}
        </div>
      </div>
      
      {/* Minimap */}
      <div className="hud-minimap military-frame">
        {/* Player dot */}
        <div
          className="minimap-dot player"
          style={{
            left: `${currentSection ? (20 + (sectionIndex / (totalSections - 1)) * 60) : 50}%`,
            top: `${currentSection ? 50 : 50}%`,
          }}
        />
        
        {/* Section dots */}
        {SECTIONS.map((sec, i) => (
          <div
            key={sec}
            className={`minimap-dot section ${sec === currentSection ? 'active' : ''}`}
            style={{
              left: `${20 + (i / (totalSections - 1)) * 60}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
          />
        ))}
        
        <div className="minimap-label">
          {SECTION_NAMES[currentSection] || 'MENU'}
        </div>
      </div>
      
      {/* Kill Feed */}
      <KillFeed audioEnabled={audioEnabled} isActive={!!currentSection} />
      
      {/* Bottom Left - Player Info + Health */}
      <div className="hud-bottom-left">
        <div className="hud-player-info">
          <span className="callsign">{CONFIG.player.callsign}</span>
          <span className="rank">{CONFIG.player.rank} // LVL {level}</span>
        </div>
        <div className="hud-health">
          <span className="hud-health-icon">+</span>
          <div className="hud-health-bar">
            <div
              className={`hud-health-fill ${healthClass}`}
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="hud-health-text">{Math.round(health)}</span>
        </div>
      </div>
      
      {/* Bottom Right - Ammo Counter */}
      <div className="hud-bottom-right">
        <div className="hud-ammo">
          <span className="hud-ammo-current">{currentSection ? sectionIndex + 1 : 0}</span>
          <span className="hud-ammo-divider">/</span>
          <span className="hud-ammo-reserve">{totalSections}</span>
        </div>
        <div className="hud-weapon-name">
          {SECTION_NAMES[currentSection] || 'SELECT MISSION'}
        </div>
      </div>
      
      {/* Bottom Center - XP Bar */}
      <div className="hud-bottom-center">
        <div className="hud-xp-label">
          <span>XP {xp.toLocaleString()}</span>
          <span>NEXT LVL {CONFIG.stats.maxXp.toLocaleString()}</span>
        </div>
        <div className="hud-xp-bar">
          <div className="hud-xp-fill" style={{ width: `${xpPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
