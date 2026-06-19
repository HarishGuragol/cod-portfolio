/* ============================================================
   Multiplayer — Projects Grid (Mission Cards)
   ============================================================ */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../config';
import { playUIHover, playUIClick } from '../../utils/audio';

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PROJECT_DETAILS = {
  "Eye-Need-A-Break": {
    system: "AI Distraction Surveillance Overlay v1.4",
    objectives: [
      "Track operative eye movement using Convolutional Neural Networks.",
      "Calculate real-time attention vector metrics and log distraction triggers.",
      "Display focus percentages on a secure tactical dashboard."
    ],
    blueprints: [
      "Backend Model: Custom lightweight TensorFlow CNN",
      "Video Stream: OpenCV video capture pipeline",
      "Frontend UI: Responsive dashboard interface"
    ]
  },
  "Survey-and-Rescue (eYRC)": {
    system: "Autonomous Aerial Search & Rescue Drone (IIT Bombay eYRC)",
    objectives: [
      "Program autonomous aerial pathfinding in simulated disaster grids.",
      "Scan terrain for survivors and calculate optimal medical package drop zones.",
      "Operate drone hardware controls under ROS constraints."
    ],
    blueprints: [
      "Orchestration: Robot Operating System (ROS)",
      "Path Algorithm: A* & Dijkstra path planning optimization",
      "Hardware: Gazebo simulator & hardware interfaces"
    ]
  },
  "Voice-Controlled Robot": {
    system: "NLP Autonomous Personal Assistant Robot",
    objectives: [
      "Initialize offline speech recognition engine with custom command matrix.",
      "Interface microcontroller with motor shield for physical steering.",
      "Execute verbal directions for field navigation."
    ],
    blueprints: [
      "Voice Core: PocketSphinx / SpeechRecognition Python library",
      "Microcontroller: Arduino Uno + L298N Motor Driver",
      "Communications: Serial RF / Bluetooth link"
    ]
  },
  "Restaurant Assistant Bot": {
    system: "Autonomous Tabletop Routing & Order Carrier",
    objectives: [
      "Calibrate precise tabletop coordinate grids for location routing.",
      "Evade static and dynamic obstacles using infrared proximity scanners.",
      "Carry order cargo payloads safely to targets."
    ],
    blueprints: [
      "Chassis: Differential drive base",
      "Navigation: Ultrasonic obstacle avoidance loop",
      "Firmware: Embedded C / Arduino IDE"
    ]
  },
  "Weed Removal Bot": {
    system: "Precision Agriculture Vision Scanner",
    objectives: [
      "Detect weed clusters in crops using color segmentation and HSV masks.",
      "Steer robotic cutter tool to weed locations with high precision.",
      "Verify elimination success rates."
    ],
    blueprints: [
      "Vision: OpenCV color extraction & morphological filters",
      "ML: Core image classification network",
      "Actuators: Step-motor coordinate tables"
    ]
  },
  "CSV-JSON Converter": {
    system: "CLI Data Pipeline Parser Package",
    objectives: [
      "Process large-scale spreadsheet datasets with high parsing speeds.",
      "Provide bidirectional CSV <-> JSON schema alignments.",
      "Deploy code as a reusable PyPI command-line utility."
    ],
    blueprints: [
      "Registry: PyPI official package server",
      "Language: Pure Python with no heavy dependencies",
      "Performance: Stream-based chunk parsing buffers"
    ]
  }
};

export default function Multiplayer({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [viewedSet, setViewedSet] = useState(new Set());

  const handleHover = () => {
    if (audioEnabled) try { playUIHover(); } catch(e) {}
  };

  const handleCardClick = (idx, name) => {
    if (audioEnabled) try { playUIClick(); } catch(e) {}
    
    if (activeIdx === idx) {
      setActiveIdx(null);
    } else {
      setActiveIdx(idx);
      
      // Track viewed dossier to complete objective
      setViewedSet(prev => {
        const next = new Set(prev);
        next.add(idx);
        if (next.size >= 2 && onCompleteObjective) {
          onCompleteObjective('multiplayer_view_projects');
        }
        return next;
      });
    }
  };
  
  return (
    <motion.div variants={stagger} initial="initial" animate="animate">
      <div className="projects-grid">
        {CONFIG.projects.map((project, i) => {
          const isOpen = activeIdx === i;
          const details = PROJECT_DETAILS[project.name] || { system: 'Classified Codebase', objectives: [], blueprints: [] };
          const hasScanned = viewedSet.has(i);

          return (
            <div key={i} style={{ display: 'contents' }}>
              <motion.div
                className={`project-card military-frame ${isOpen ? 'active' : ''}`}
                variants={fadeUp}
                onMouseEnter={handleHover}
                onClick={() => handleCardClick(i, project.name)}
                style={{
                  borderColor: isOpen ? 'var(--cod-secondary)' : 'var(--cod-border)',
                  boxShadow: isOpen ? '0 0 20px rgba(255, 106, 0, 0.2)' : 'none'
                }}
              >
                <div className="project-codename" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{project.codename}</span>
                  {hasScanned && <span style={{ color: 'var(--cod-primary)' }}>[DOSSIER SCANNED]</span>}
                </div>
                <h3 className="project-name" style={{ color: isOpen ? 'var(--cod-secondary)' : 'var(--cod-text-bright)' }}>
                  {project.name}
                </h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tech">
                  {project.tech.map((t, j) => (
                    <span key={j} className="project-tech-tag">{t}</span>
                  ))}
                </div>
                
                <div className="project-footer">
                  <span className={`project-status ${project.status === 'MISSION COMPLETE' ? 'complete' : 'active'}`}>
                    {project.status === 'MISSION COMPLETE' ? '✓ ' : '● '}{project.status}
                  </span>
                  <span className={`project-difficulty ${project.difficulty.toLowerCase()}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                <div className="project-links" onClick={(e) => e.stopPropagation()}>
                  <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                    ▸ DEPLOY SYSTEM
                  </a>
                  <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">
                    ▸ REPOSITORY
                  </a>
                </div>
              </motion.div>

              {/* Dossier Detail Drawer */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="dossier-drawer military-frame crt-flicker"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="drawer-header">
                      <span className="drawer-title">SYSTEM PROFILE: {details.system}</span>
                      <span className="drawer-codename">TACTICAL SCHEMATIC // SECURE DECRYPT</span>
                    </div>
                    <div className="drawer-content">
                      <div className="drawer-specs-grid">
                        <div>
                          <div className="spec-column-title">OPERATIONAL GOALS</div>
                          <ul className="spec-list">
                            {details.objectives.map((obj, k) => (
                              <li key={k}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="spec-column-title">SYSTEM BLUEPRINTS</div>
                          <ul className="spec-list">
                            {details.blueprints.map((bp, k) => (
                              <li key={k}>{bp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
