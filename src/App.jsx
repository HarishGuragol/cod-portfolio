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
  
  // ── Operative Stats (Stateful) ─────────────────────────────
  const [xp, setXp] = useState(CONFIG.stats.xp);
  const [level, setLevel] = useState(CONFIG.stats.level);
  const [completedObjectives, setCompletedObjectives] = useState([]);
  const [levelUpAlert, setLevelUpAlert] = useState(false);
  
  // ── Boot Complete ─────────────────────────────────────────
  const handleBootComplete = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
    setGameState(STATES.MENU);
  }, []);
  
  // ── Section Selection (Triggers Briefing) ──────────────────
  const handleSelectSection = useCallback((sectionId) => {
    if (audioEnabled) {
      try { playTransitionStatic(); } catch(e) {}
    }
    setPendingSection(sectionId);
    setGameState(STATES.BRIEFING);
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
      setGameState(STATES.MENU);
    }, 150);
  }, [audioEnabled]);
  
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
  
  // ── Keyboard Shortcuts ────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC — back to menu
      if (e.key === 'Escape') {
        if (gameState === STATES.SECTION) {
          handleBackToMenu();
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
  }, [gameState, handleBackToMenu, handleToggleNightVision, handleToggleAudio]);
  
  return (
    <div className={`app-root ${nightVision ? 'night-vision-active' : ''}`}>
      {/* Custom Crosshair Cursor */}
      <Crosshair />

      {/* 3D Background — always rendered */}
      <BattlefieldScene />
      
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
        
        {/* Main Menu */}
        {gameState === STATES.MENU && (
          <MainMenu
            onSelectSection={handleSelectSection}
            audioEnabled={audioEnabled}
            xp={xp}
            level={level}
          />
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
      
      {/* HUD — visible in menu, briefing & section states */}
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

