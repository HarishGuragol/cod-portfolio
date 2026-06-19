/* ============================================================
   App.jsx — Main Application Controller
   Manages game state: boot → menu → briefing → sections
   XP, Leveling, and Objectives tracking
   ============================================================ */
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import BattlefieldScene from './components/BattlefieldScene';
import BootScreen from './components/BootScreen';
import MainMenu from './components/MainMenu';
import MissionBriefing from './components/MissionBriefing';
import HUD from './components/HUD';
import SectionRenderer from './components/SectionRenderer';
import Crosshair from './components/Crosshair';
import CONFIG from './config';
import { playTransitionStatic, playUIClick, playObjectiveComplete, playLevelUp, resumeAudio } from './utils/audio';
import './index.css';
import './styles/boot.css';
import './styles/menu.css';
import './styles/hud.css';
import './styles/sections.css';
import './styles/effects.css';

// Game states
const STATES = {
  BOOT: 'boot',
  MENU: 'menu',
  PLAYING_3D: 'playing_3d',
  BRIEFING: 'briefing',
  SECTION: 'section',
};

export default function App() {
  const [gameState, setGameState] = useState(STATES.BOOT);
  const [currentSection, setCurrentSection] = useState(null);
  const [pendingSection, setPendingSection] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(CONFIG.audio.enabled);
  const [nightVision, setNightVision] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  
  // ── 3D Playable Walkthrough State ──────────────────────────
  const [activeTerminal, setActiveTerminal] = useState(null);
  const [virtualDir, setVirtualDir] = useState('');
  const [isWalking, setIsWalking] = useState(false);
  const [isFiring, setIsFiring] = useState(false);
  const [cameFrom3D, setCameFrom3D] = useState(false);

  // ── Operative Stats (Stateful) ─────────────────────────────
  const [xp, setXp] = useState(CONFIG.stats.xp);
  const [level, setLevel] = useState(CONFIG.stats.level);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [levelUpAlert, setLevelUpAlert] = useState(false);
  
  // ── Boot Complete ─────────────────────────────────────────
  const handleBootComplete = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
    setGameState(STATES.PLAYING_3D); // Start in 3D mode directly!
  }, []);
  
  // ── Section Selection (Triggers Briefing) ──────────────────
  const handleSelectSection = useCallback((sectionId) => {
    if (audioEnabled) {
      try { playTransitionStatic(); } catch(e) {}
    }
    setPendingSection(sectionId);
    setGameState(STATES.BRIEFING);
  }, [audioEnabled]);

  // Launch 3D Walkthrough Mode (retained as backup)
  const handleSelect3DMode = useCallback(() => {
    if (audioEnabled) {
      try { playUIClick(); } catch(e) {}
    }
    setCameFrom3D(true);
    setGameState(STATES.PLAYING_3D);
  }, [audioEnabled]);

  // ── Briefing Complete (Enters Section) ─────────────────────
  const handleBriefingComplete = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setCurrentSection(pendingSection);
      setGameState(STATES.SECTION);
    }, 150);
  }, [pendingSection]);
  
  // ── Back to Menu ──────────────────────────────────────────
  const handleBackToMenu = useCallback(() => {
    if (audioEnabled) {
      try { playTransitionStatic(); } catch(e) {}
    }
    setShowFlash(true);
    setTimeout(() => {
      setShowFlash(false);
      setCurrentSection(null);
      setPendingSection(null);
      setGameState(STATES.PLAYING_3D); // Always return to 3D walkable bunker!
    }, 150);
  }, [audioEnabled]);

  // Terminal Proximity Interaction
  const handleInteract = useCallback(() => {
    if (activeTerminal) {
      handleSelectSection(activeTerminal.id);
    }
  }, [activeTerminal, handleSelectSection]);
  
  // ── Audio Toggle ──────────────────────────────────────────
  const handleToggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
    resumeAudio();
  }, []);
  
  // ── Night Vision Toggle ───────────────────────────────────
  const handleToggleNightVision = useCallback(() => {
    setNightVision(prev => !prev);
    if (audioEnabled) try { playUIClick(); } catch(e) {}
  }, [audioEnabled]);
  
  // ── Objective Tracking & XP Reward ────────────────────────
  const handleCompleteObjective = useCallback((objectiveId) => {
    setCompletedObjectives(prev => {
      if (prev.includes(objectiveId)) return prev;
      
      // Play sound
      if (audioEnabled) {
        try { playObjectiveComplete(); } catch (e) {}
      }
      
      // Calculate XP rewards based on tasks
      let xpReward = 2000;
      if (objectiveId === 'comms_secure_uplink') xpReward = 5000;
      if (objectiveId.startsWith('multiplayer_')) xpReward = 1500;
      
      setXp(currentXp => {
        let nextXp = currentXp + xpReward;
        if (nextXp >= 100000) {
          setLevel(currentLevel => {
            if (audioEnabled) {
              try { playLevelUp(); } catch (e) {}
            }
            setLevelUpAlert(true);
            setTimeout(() => setLevelUpAlert(false), 6000);
            return currentLevel + 1;
          });
          return nextXp - 100000;
        }
        return nextXp;
      });
      
      return [...prev, objectiveId];
    });
  }, [audioEnabled]);

  // Onboarding Tutorial State
  const [showTutorial, setShowTutorial] = useState(true);

  // FPS Muzzle Recoil Fire click listener
  useEffect(() => {
    if (gameState !== STATES.PLAYING_3D) return;

    const handleMouseClick = (e) => {
      if (e.target.closest('button, kbd, .virtual-dpad, .proximity-prompt-overlay, .hud-onboarding-panel')) return;

      setIsFiring(true);
      if (audioEnabled) {
        try {
          // Play programmatic synthesized gunshot clank
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(200, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
          osc.start();
          osc.stop(ctx.currentTime + 0.12);
        } catch (err) {}
      }
      setTimeout(() => setIsFiring(false), 120);
    };

    window.addEventListener('click', handleMouseClick);
    return () => window.removeEventListener('click', handleMouseClick);
  }, [gameState, audioEnabled]);
  
  // ── Keyboard Shortcuts ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC — back to menu
      if (e.key === 'Escape') {
        if (gameState === STATES.SECTION) {
          handleBackToMenu();
        } else if (gameState === STATES.PLAYING_3D) {
          setCameFrom3D(false);
        }
      }
      
      // E — interact in 3D
      if (e.key === 'e' || e.key === 'E') {
        if (gameState === STATES.PLAYING_3D) {
          handleInteract();
        }
      }

      // N — toggle night vision
      if (e.key === 'n' || e.key === 'N') {
        if (gameState !== STATES.BOOT) {
          handleToggleNightVision();
        }
      }
      
      // M — toggle audio
      if (e.key === 'm' || e.key === 'M') {
        if (gameState !== STATES.BOOT) {
          handleToggleAudio();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleBackToMenu, handleToggleNightVision, handleToggleAudio, handleInteract]);
  
  return (
    <div className={`app-root ${nightVision ? 'night-vision-active' : ''}`}>
      {/* Custom Crosshair Cursor */}
      <Crosshair />

      {/* 3D Background & Bunker Room */}
      <BattlefieldScene
        is3DMode={gameState === STATES.PLAYING_3D}
        virtualDir={virtualDir}
        activeTerminalId={activeTerminal?.id}
        onNearTerminal={setActiveTerminal}
        onUpdateWalking={setIsWalking}
      />
      
      {/* Scanline overlay */}
      <div className="scanline-overlay" />
      
      {/* Vignette */}
      <div className="vignette-overlay" />
      
      {/* Transition flash */}
      {showFlash && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'white',
            zIndex: 999,
            opacity: 0.6,
            animation: 'section-flash 0.3s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Game States */}
      <AnimatePresence mode="wait">
        {/* Boot Screen */}
        {gameState === STATES.BOOT && (
          <BootScreen onComplete={handleBootComplete} />
        )}
        
        {/* Mission Briefing Loading Screen */}
        {gameState === STATES.BRIEFING && pendingSection && (
          <MissionBriefing
            sectionId={pendingSection}
            onComplete={handleBriefingComplete}
            audioEnabled={audioEnabled}
          />
        )}
        
        {/* Section Content */}
        {gameState === STATES.SECTION && currentSection && (
          <SectionRenderer
            currentSection={currentSection}
            onBack={handleBackToMenu}
            audioEnabled={audioEnabled}
            completedObjectives={completedObjectives}
            onCompleteObjective={handleCompleteObjective}
          />
        )}
      </AnimatePresence>
      
      {/* FPS Weapon Overlay */}
      {gameState === STATES.PLAYING_3D && (
        <div className="fps-weapon-viewport">
          <img
            src="/images/weapon.png"
            alt="FPS Weapon"
            className={`fps-weapon-image ${isWalking ? 'walking-bob' : ''} ${isFiring ? 'firing-recoil' : ''}`}
          />
        </div>
      )}

      {/* Proximity Interaction Prompt */}
      {gameState === STATES.PLAYING_3D && activeTerminal && (
        <div className="proximity-prompt-overlay">
          <div className="prompt-box" onClick={handleInteract}>
            [E] OPEN {activeTerminal.label}
          </div>
          <div className="prompt-sub">PRESS 'E' OR CLICK TO DEPLOY MISSION</div>
        </div>
      )}

      {/* Virtual D-pad (Touch / Mobile support) */}
      {gameState === STATES.PLAYING_3D && (
        <div className="virtual-dpad">
          <button 
            className="dpad-btn dpad-up" 
            onMouseDown={() => setVirtualDir('UP')} 
            onMouseUp={() => setVirtualDir('')}
            onMouseLeave={() => setVirtualDir('')}
            onTouchStart={() => setVirtualDir('UP')}
            onTouchEnd={() => setVirtualDir('')}
          >▲</button>
          <button 
            className="dpad-btn dpad-left" 
            onMouseDown={() => setVirtualDir('LEFT')} 
            onMouseUp={() => setVirtualDir('')}
            onMouseLeave={() => setVirtualDir('')}
            onTouchStart={() => setVirtualDir('LEFT')}
            onTouchEnd={() => setVirtualDir('')}
          >◀</button>
          <div className="dpad-center">WASD<br/>D-PAD</div>
          <button 
            className="dpad-btn dpad-right" 
            onMouseDown={() => setVirtualDir('RIGHT')} 
            onMouseUp={() => setVirtualDir('')}
            onMouseLeave={() => setVirtualDir('')}
            onTouchStart={() => setVirtualDir('RIGHT')}
            onTouchEnd={() => setVirtualDir('')}
          >▶</button>
          <button 
            className="dpad-btn dpad-down" 
            onMouseDown={() => setVirtualDir('DOWN')} 
            onMouseUp={() => setVirtualDir('')}
            onMouseLeave={() => setVirtualDir('')}
            onTouchStart={() => setVirtualDir('DOWN')}
            onTouchEnd={() => setVirtualDir('')}
          >▼</button>
        </div>
      )}

      {/* Onboarding Tutorial Info */}
      {gameState === STATES.PLAYING_3D && showTutorial && (
        <div className="hud-objectives crt-flicker hud-onboarding-panel" style={{ top: '220px', borderColor: 'var(--cod-primary)', width: '280px', pointerEvents: 'auto', zIndex: 1000 }}>
          <div className="hud-objectives-header" style={{ color: 'var(--cod-primary)' }}>
            <span>TACTICAL INSTRUCTIONS</span>
            <button 
              onClick={() => setShowTutorial(false)}
              style={{ background: 'none', border: 'none', color: 'var(--cod-danger)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 'bold' }}
            >
              [X] CLOSE
            </button>
          </div>
          <div className="objectives-list" style={{ fontSize: '0.55rem', color: 'var(--cod-text)', lineHeight: '1.5' }}>
            <div style={{ marginBottom: '6px' }}>▪ USE <kbd>W</kbd>/<kbd>S</kbd> TO WALK FORWARD/BACKWARD</div>
            <div style={{ marginBottom: '6px' }}>▪ USE <kbd>A</kbd>/<kbd>D</kbd> OR DRAG MOUSE TO ROTATE VIEW</div>
            <div style={{ marginBottom: '6px' }}>▪ POINT & CLICK ANYWHERE TO FIRE WEAPON</div>
            <div style={{ marginBottom: '6px' }}>▪ APPROACH BUNKER DOORS & LOOK AT THEM</div>
            <div style={{ marginBottom: '6px' }}>▪ PRESS <kbd>E</kbd> OR CLICK PROMPT TO OPEN THE DOOR</div>
            <div>▪ PRESS <kbd>N</kbd> FOR NIGHT VISION / <kbd>M</kbd> FOR AUDIO</div>
          </div>
        </div>
      )}

      {/* HUD — visible in menu, playing 3D, briefing & section states */}
      {gameState !== STATES.BOOT && (
        <HUD
          currentSection={currentSection}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
          nightVision={nightVision}
          onToggleNightVision={handleToggleNightVision}
          onBackToMenu={handleBackToMenu}
          xp={xp}
          level={level}
          completedObjectives={completedObjectives}
          levelUpAlert={levelUpAlert}
        />
      )}
    </div>
  );
}

