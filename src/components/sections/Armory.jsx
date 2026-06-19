/* ============================================================
   Armory — Interactive Gunsmith Workbench
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playWeaponEquip } from '../../utils/audio';

const WEAPONS = [
  {
    id: 'flutter',
    cat: 'PRIMARY ASSAULT RIFLE',
    name: 'FLT-95 "VANGUARD"',
    codename: 'BLUE-ARROW // MOBILE ENGAGEMENT',
    desc: 'High-velocity cross-platform framework. Deploys custom-compiled native code with surgical UI precision across iOS, Android, and Desktop arenas.',
    image: '/images/weapon.png',
    stats: { damage: 95, firerate: 90, range: 95, mobility: 88 },
    attachments: ['Bloc Optic', 'Dart Engine', 'Material Suppressor', 'Riverpod Grip']
  },
  {
    id: 'react',
    cat: 'TACTICAL CARBINE',
    name: 'RCT-88 "SPECTRE"',
    codename: 'ATOM-REACT // COMPONENT ASSAULT',
    desc: 'High-efficiency reactive weapon. Excellent for rendering rapid tactical web interfaces, component modularity, and client-side operations.',
    image: '/images/weapon.png',
    stats: { damage: 88, firerate: 95, range: 85, mobility: 92 },
    attachments: ['Redux Scope', 'Vite Receiver', 'Tailwind Stock', 'NextJS Barrel']
  },
  {
    id: 'python',
    cat: 'MARKSMAN SNIPER RIFLE',
    name: 'PY-92 "CONSTRICTOR"',
    codename: 'SERPENT-ML // TACTICAL ANALYSIS',
    desc: 'Long-range intelligence gathering and statistical execution. Deploys advanced machine learning models and automation payloads with extreme accuracy.',
    image: '/images/weapon.png',
    stats: { damage: 92, firerate: 70, range: 98, mobility: 80 },
    attachments: ['TensorFlow Barrel', 'NumPy Magazine', 'PyTorch Laser', 'Pandas Stock']
  },
  {
    id: 'java',
    cat: 'HEAVY MACHINE GUN',
    name: 'JV-85 "TITAN"',
    codename: 'PLATINUM-CORE // BACKEND SUPPORT',
    desc: 'Heavy enterprise-grade compiler platform. Engineered for high reliability, multi-threaded computations, and backend fortifications.',
    image: '/images/weapon.png',
    stats: { damage: 85, firerate: 75, range: 90, mobility: 70 },
    attachments: ['Spring Boot Ammo', 'Maven Receiver', 'Hibernate Underbarrel', 'JVM Muzzle']
  }
];

export default function Armory({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPONS[0]);
  const [equippedId, setEquippedId] = useState(null);
  
  // Slide stat bar animations
  const [stats, setStats] = useState({ damage: 0, firerate: 0, range: 0, mobility: 0 });

  useEffect(() => {
    // Animate stats to current selection
    const timer = setTimeout(() => {
      setStats(selectedWeapon.stats);
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedWeapon]);

  const handleSelect = (weapon) => {
    setSelectedWeapon(weapon);
  };

  const handleEquip = () => {
    if (audioEnabled) {
      try { playWeaponEquip(); } catch (e) {}
    }
    setEquippedId(selectedWeapon.id);
    
    // Complete objective
    if (onCompleteObjective) {
      onCompleteObjective('armory_equip_weapon');
    }
  };

  const isEquipped = equippedId === selectedWeapon.id;

  return (
    <div className="gunsmith-workbench">
      {/* Left panel: Weapons select */}
      <div className="weapons-list">
        {WEAPONS.map(weapon => (
          <button
            key={weapon.id}
            className={`weapon-select-card military-frame ${selectedWeapon.id === weapon.id ? 'selected' : ''}`}
            onClick={() => handleSelect(weapon)}
          >
            <span className="weapon-cat">{weapon.cat}</span>
            <span className="weapon-name">{weapon.name}</span>
          </button>
        ))}
        
        <div style={{
          marginTop: '20px',
          padding: '10px',
          border: '1px dashed var(--cod-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          color: 'var(--cod-text-dim)',
          lineHeight: '1.4'
        }}>
          // EQUIPMENT STATS CORRESPOND TO REAL-TIME EXPERIENCE LEVELS. CALIBRATE BEFORE DEPLOYMENT.
        </div>
      </div>

      {/* Right panel: Gunsmith display */}
      <div className="gunsmith-display">
        <div className="gunsmith-main-panel military-frame">
          {/* Blueprint image view */}
          <div className="weapon-blueprint-view">
            <div className="blueprint-grid-lines" />
            <div className="blueprint-codename">{selectedWeapon.codename}</div>
            <img src={selectedWeapon.image} alt={selectedWeapon.name} className="blueprint-img" />
            
            {/* Attachment layout */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginTop: '16px',
              justifyContent: 'center',
              zIndex: 2
            }}>
              {selectedWeapon.attachments.map(att => (
                <span key={att} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  padding: '2px 6px',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  background: 'rgba(0, 255, 65, 0.05)',
                  color: 'var(--cod-primary)',
                  borderRadius: '2px'
                }}>
                  ▪ {att}
                </span>
              ))}
            </div>
          </div>

          {/* Stats and description panel */}
          <div className="weapon-specs-panel">
            <div className="weapon-specs-header">
              <h2 className="weapon-specs-title">{selectedWeapon.name}</h2>
              <div className="weapon-specs-desc">{selectedWeapon.desc}</div>
            </div>

            <div className="weapon-stats-list">
              <div className="weapon-stat-row">
                <div className="weapon-stat-info">
                  <span>DAMAGE (PROFICIENCY)</span>
                  <span>{stats.damage}%</span>
                </div>
                <div className="weapon-stat-bar">
                  <div className="weapon-stat-fill" style={{ width: `${stats.damage}%` }} />
                </div>
              </div>

              <div className="weapon-stat-row">
                <div className="weapon-stat-info">
                  <span>FIRE RATE (VELOCITY)</span>
                  <span>{stats.firerate}%</span>
                </div>
                <div className="weapon-stat-bar">
                  <div className="weapon-stat-fill" style={{ width: `${stats.firerate}%` }} />
                </div>
              </div>

              <div className="weapon-stat-row">
                <div className="weapon-stat-info">
                  <span>RANGE (VERSATILITY)</span>
                  <span>{stats.range}%</span>
                </div>
                <div className="weapon-stat-bar">
                  <div className="weapon-stat-fill" style={{ width: `${stats.range}%` }} />
                </div>
              </div>

              <div className="weapon-stat-row">
                <div className="weapon-stat-info">
                  <span>MOBILITY (FLEXIBILITY)</span>
                  <span>{stats.mobility}%</span>
                </div>
                <div className="weapon-stat-bar">
                  <div className="weapon-stat-fill" style={{ width: `${stats.mobility}%` }} />
                </div>
              </div>
            </div>

            {/* Equip button */}
            <div style={{ marginTop: 'auto' }}>
              <button
                className={`weapon-equip-btn ${isEquipped ? 'equipped' : ''}`}
                onClick={handleEquip}
              >
                {isEquipped ? '✓ LOADOUT EQUIPPED' : '🔫 EQUIP IN LOADOUT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
