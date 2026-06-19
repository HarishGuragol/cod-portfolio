/* ============================================================
   SectionRenderer — Renders active section with transitions
   ============================================================ */
import { motion, AnimatePresence } from 'framer-motion';
import { playTransitionStatic, playUIClick } from '../utils/audio';
import Campaign from './sections/Campaign';
import Multiplayer from './sections/Multiplayer';
import Armory from './sections/Armory';
import Barracks from './sections/Barracks';
import Comms from './sections/Comms';
import '../styles/sections.css';

const SECTION_META = {
  campaign: { tag: '// CLASSIFIED DOSSIER', title: 'Campaign', subtitle: 'Operative Profile & Deployment History', icon: '🎖️' },
  multiplayer: { tag: '// MISSION DATABASE', title: 'Multiplayer', subtitle: 'Completed & Active Operations', icon: '⚔️' },
  armory: { tag: '// WEAPONS CACHE', title: 'Armory', subtitle: 'Technology Loadout & Proficiency', icon: '🔫' },
  barracks: { tag: '// TRAINING RECORDS', title: 'Barracks', subtitle: 'Education & Specialist Qualifications', icon: '🏛️' },
  comms: { tag: '// SECURE CHANNEL', title: 'Comms', subtitle: 'Communication Channels & Contact', icon: '📡' },
};

const COMPONENTS = {
  campaign: Campaign,
  multiplayer: Multiplayer,
  armory: Armory,
  barracks: Barracks,
  comms: Comms,
};

const SECTION_BGS = {
  campaign: '/images/tactical-bg.png',
  multiplayer: '/images/warzone.png',
  armory: '/images/weapon.png',
  barracks: '/images/tactical-bg.png',
  comms: '/images/warzone.png',
};

export default function SectionRenderer({
  currentSection,
  onBack,
  audioEnabled,
  completedObjectives = [],
  onCompleteObjective,
}) {
  const meta = SECTION_META[currentSection];
  const Component = COMPONENTS[currentSection];
  
  if (!meta || !Component) return null;
  
  const handleBack = () => {
    if (audioEnabled) try { playUIClick(); } catch(e) {}
    onBack();
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSection}
        className="section-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Fixed cinematic background */}
        <div 
          className="section-bg-image" 
          style={{ backgroundImage: `url(${SECTION_BGS[currentSection]})` }}
        />
        <div className="section-bg-overlay" />

        {/* Back button */}
        <button className="section-back-btn" onClick={handleBack} id="back-btn">
          ◂ ESC // BACK TO MENU
        </button>
        
        <div className="section-content">
          {/* Section header */}
          <motion.div
            className="section-header"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="section-tag">{meta.tag}</div>
            <h1 className="section-title">{meta.icon} {meta.title}</h1>
            <p className="section-subtitle">{meta.subtitle}</p>
          </motion.div>
          
          {/* Section content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Component 
              audioEnabled={audioEnabled}
              completedObjectives={completedObjectives}
              onCompleteObjective={onCompleteObjective}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
