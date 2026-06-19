/* ============================================================
   Armory — Interactive Gunsmith Workbench (Call of Duty Style)
   ============================================================ */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playWeaponEquip, playUIClick } from '../../utils/audio';

const WEAPONS = [
  {
    id: 'flutter',
    cat: 'PRIMARY ASSAULT RIFLE',
    name: 'FLT-95 "VANGUARD"',
    codename: 'BLUE-ARROW // MOBILE ENGAGEMENT',
    desc: 'High-velocity cross-platform framework. Deploys custom-compiled native code with surgical UI precision across iOS, Android, and Desktop arenas.',
    image: '/images/weapon.png',
    stats: { damage: 85, firerate: 80, range: 75, mobility: 88 },
  },
  {
    id: 'react',
    cat: 'TACTICAL CARBINE',
    name: 'RCT-88 "SPECTRE"',
    codename: 'ATOM-REACT // COMPONENT ASSAULT',
    desc: 'High-efficiency reactive weapon. Excellent for rendering rapid tactical web interfaces, component modularity, and client-side operations.',
    image: '/images/weapon.png',
    stats: { damage: 78, firerate: 92, range: 68, mobility: 90 },
  },
  {
    id: 'python',
    cat: 'MARKSMAN SNIPER RIFLE',
    name: 'PY-92 "CONSTRICTOR"',
    codename: 'SERPENT-ML // TACTICAL ANALYSIS',
    desc: 'Long-range intelligence gathering and statistical execution. Deploys advanced machine learning models and automation payloads with extreme accuracy.',
    image: '/images/weapon.png',
    stats: { damage: 92, firerate: 45, range: 95, mobility: 65 },
  },
  {
    id: 'java',
    cat: 'HEAVY MACHINE GUN',
    name: 'JV-85 "TITAN"',
    codename: 'PLATINUM-CORE // BACKEND SUPPORT',
    desc: 'Heavy enterprise-grade compiler platform. Engineered for high reliability, multi-threaded computations, and backend fortifications.',
    image: '/images/weapon.png',
    stats: { damage: 80, firerate: 68, range: 82, mobility: 55 },
  }
];

const ATTACHMENTS = {
  muzzle: [
    { name: 'None', damage: 0, range: 0, mobility: 0, firerate: 0, desc: 'Factory default muzzle brake' },
    { name: 'Monolithic Suppressor', damage: 5, range: 12, mobility: -6, firerate: 0, desc: 'Sound suppression & increased range' },
    { name: 'Tactical Flash Guard', damage: 8, range: 4, mobility: -2, firerate: 0, desc: 'Suppresses muzzle flash, improves damage' },
    { name: 'Breacher Muzzle Brake', damage: 12, range: -4, mobility: -4, firerate: 0, desc: 'Heavy muzzle brake for close quarters combat' },
  ],
  optic: [
    { name: 'None', damage: 0, range: 0, mobility: 0, firerate: 0, desc: 'Factory iron sights' },
    { name: 'Viper Reflex Sight', damage: 0, range: 8, mobility: -3, firerate: 0, desc: 'Clear sight picture, minor range increase' },
    { name: 'Corp Combat Holo', damage: 0, range: 12, mobility: -5, firerate: 0, desc: 'Frameless holographic reticle for target acquisition' },
    { name: 'Sniper Scope 4.0x', damage: 4, range: 22, mobility: -12, firerate: 0, desc: 'Magnified precision optic for long range' },
  ],
  underbarrel: [
    { name: 'None', damage: 0, range: 0, mobility: 0, firerate: 0, desc: 'No undergrip attachment' },
    { name: 'Commando Foregrip', damage: 2, range: 6, mobility: -3, firerate: 0, desc: 'Horizontal recoil stabilization' },
    { name: 'Merc Foregrip', damage: 6, range: 2, mobility: 4, firerate: 0, desc: 'Increases hipfire accuracy & movement speed' },
    { name: 'Ranger Foregrip', damage: 3, range: 10, mobility: -4, firerate: 0, desc: 'Vertical recoil control and aiming stability' },
  ],
  magazine: [
    { name: 'Standard Mags', damage: 0, range: 0, mobility: 0, firerate: 0, desc: 'Factory specification magazine capacity' },
    { name: '45-Round Mags', damage: 0, range: 0, mobility: -5, firerate: 8, desc: 'Extended capacity with slight mobility penalty' },
    { name: '60-Round Drums', damage: 0, range: -4, mobility: -10, firerate: 15, desc: 'Max ammunition loadout, reduces reload and mobility' },
    { name: 'Fast Sleight Reload', damage: 0, range: 0, mobility: 2, firerate: 6, desc: 'Rapid magazine swap speed' },
  ]
};

const CAMOS = [
  { id: 'standard', name: 'STANDARD', filter: 'none', color: '#00ff41', desc: 'Military issue matte finish' },
  { id: 'olive', name: 'OLIVE DRAB', filter: 'hue-rotate(50deg) saturate(0.8) brightness(0.9)', color: '#4b5320', desc: 'Tactical jungle camouflage coating' },
  { id: 'gold', name: '🏆 GOLD PLATED', filter: 'sepia(1.2) saturate(8) hue-rotate(15deg) brightness(1.2) drop-shadow(0 0 10px gold)', color: '#ffd700', desc: 'Polished 24k gold plating (Prestige unlock)' },
  { id: 'damascus', name: '🌀 DAMASCUS', filter: 'saturate(3) hue-rotate(185deg) brightness(1.1) contrast(1.1) drop-shadow(0 0 10px #00d4ff)', color: '#00d4ff', desc: 'Layered high-carbon steel ripple waves' },
  { id: 'obsidian', name: '🔥 OBSIDIAN', filter: 'brightness(0.18) contrast(3.5) saturate(0.2) drop-shadow(0 0 10px #7000ff)', color: '#7000ff', desc: 'Crystalline glossy volcanic glass shroud' }
];

export default function Armory({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [selectedWeapon, setSelectedWeapon] = useState(WEAPONS[0]);
  const [equippedId, setEquippedId] = useState(null);
  
  // Customizer selections
  const [attachments, setAttachments] = useState({
    muzzle: ATTACHMENTS.muzzle[0],
    optic: ATTACHMENTS.optic[0],
    underbarrel: ATTACHMENTS.underbarrel[0],
    magazine: ATTACHMENTS.magazine[0]
  });
  const [selectedCamo, setSelectedCamo] = useState(CAMOS[0]);
  const [hoveredAttachment, setHoveredAttachment] = useState(null); // { category, item }
  const [activeCategory, setActiveCategory] = useState(null); // muzzle, optic, underbarrel, magazine
  
  // Reset customizer when weapon changes
  useEffect(() => {
    setAttachments({
      muzzle: ATTACHMENTS.muzzle[0],
      optic: ATTACHMENTS.optic[0],
      underbarrel: ATTACHMENTS.underbarrel[0],
      magazine: ATTACHMENTS.magazine[0]
    });
    setSelectedCamo(CAMOS[0]);
    setActiveCategory(null);
  }, [selectedWeapon]);

  // Lock sound generator
  const playLockSound = () => {
    if (!audioEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const handleSelectWeapon = (weapon) => {
    if (audioEnabled) {
      try { playUIClick(); } catch (e) {}
    }
    setSelectedWeapon(weapon);
  };

  const handleEquipAttachment = (category, item) => {
    playLockSound();
    setAttachments(prev => ({
      ...prev,
      [category]: item
    }));
  };

  const handleSelectCamo = (camo) => {
    if (audioEnabled) {
      try { playUIClick(); } catch (e) {}
    }
    setSelectedCamo(camo);
  };

  const handleEquipWeapon = () => {
    if (audioEnabled) {
      try { playWeaponEquip(); } catch (e) {}
    }
    setEquippedId(selectedWeapon.id);
    if (onCompleteObjective) {
      onCompleteObjective('armory_equip_weapon');
    }
  };

  // Helper to calculate total weapon stats (base + active attachments)
  const getStatVal = (statName) => {
    const base = selectedWeapon.stats[statName];
    const add = 
      attachments.muzzle[statName] +
      attachments.optic[statName] +
      attachments.underbarrel[statName] +
      attachments.magazine[statName];
    return Math.max(10, Math.min(100, base + add));
  };

  // Helper to calculate hovered preview value
  const getPreviewStatVal = (statName) => {
    if (!hoveredAttachment) return getStatVal(statName);
    const { category, item } = hoveredAttachment;
    const base = selectedWeapon.stats[statName];
    
    // Sum other categories + hovered one
    let sum = 0;
    Object.keys(attachments).forEach(cat => {
      if (cat === category) {
        sum += item[statName];
      } else {
        sum += attachments[cat][statName];
      }
    });
    return Math.max(10, Math.min(100, base + sum));
  };

  const isEquipped = equippedId === selectedWeapon.id;

  return (
    <div className="gunsmith-workbench">
      {/* Left Panel: Weapon Arsenal List */}
      <div className="weapons-list">
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--cod-secondary)',
          letterSpacing: '2px',
          marginBottom: '6px',
          textTransform: 'uppercase'
        }}>
          ▪ PRIMARY ARSENAL
        </div>
        {WEAPONS.map(weapon => (
          <button
            key={weapon.id}
            className={`weapon-select-card military-frame ${selectedWeapon.id === weapon.id ? 'selected' : ''}`}
            onClick={() => handleSelectWeapon(weapon)}
          >
            <span className="weapon-cat">{weapon.cat}</span>
            <span className="weapon-name">{weapon.name}</span>
          </button>
        ))}

        {/* Camo Coatings */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--cod-secondary)',
          letterSpacing: '2px',
          marginTop: '20px',
          marginBottom: '6px',
          textTransform: 'uppercase'
        }}>
          ▪ CAMO SHADERS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {CAMOS.map(camo => (
            <button
              key={camo.id}
              onClick={() => handleSelectCamo(camo)}
              style={{
                background: selectedCamo.id === camo.id ? 'rgba(0, 255, 65, 0.08)' : 'rgba(2, 4, 2, 0.7)',
                border: '1px solid',
                borderColor: selectedCamo.id === camo.id ? 'var(--cod-primary)' : 'var(--cod-border)',
                color: selectedCamo.id === camo.id ? 'var(--cod-primary)' : 'var(--cod-text)',
                padding: '6px 10px',
                textAlign: 'left',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ color: camo.color, marginRight: '4px' }}>■</span>
              {camo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right Customizer Panel */}
      <div className="gunsmith-display">
        <div className="gunsmith-main-panel military-frame" style={{ gridTemplateColumns: '1fr 310px' }}>
          {/* Blueprint Graphic View */}
          <div className="weapon-blueprint-view">
            <div className="blueprint-grid-lines" />
            <div className="blueprint-codename" style={{ color: selectedCamo.color }}>
              {selectedWeapon.codename} // CAMO: {selectedCamo.name}
            </div>

            {/* Float HUD Tags for active attachments */}
            <div style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'var(--cod-primary)',
              textAlign: 'right',
              lineHeight: '1.4'
            }}>
              <div>MUZZLE: <span style={{ color: '#fff' }}>{attachments.muzzle.name}</span></div>
              <div>OPTIC: <span style={{ color: '#fff' }}>{attachments.optic.name}</span></div>
              <div>GRIP: <span style={{ color: '#fff' }}>{attachments.underbarrel.name}</span></div>
              <div>MAG: <span style={{ color: '#fff' }}>{attachments.magazine.name}</span></div>
            </div>

            <img
              src={selectedWeapon.image}
              alt={selectedWeapon.name}
              className="blueprint-img"
              style={{ filter: selectedCamo.filter }}
            />

            {/* Customizer Slots (Interactions) */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '25px',
              zIndex: 10
            }}>
              {['muzzle', 'optic', 'underbarrel', 'magazine'].map(category => (
                <button
                  key={category}
                  onClick={() => {
                    playLockSound();
                    setActiveCategory(activeCategory === category ? null : category);
                  }}
                  style={{
                    background: activeCategory === category ? 'var(--cod-primary)' : 'rgba(2, 4, 2, 0.9)',
                    border: '1px solid',
                    borderColor: activeCategory === category ? 'var(--cod-primary)' : 'var(--cod-primary-dim)',
                    color: activeCategory === category ? '#020402' : 'var(--cod-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.55rem',
                    padding: '4px 10px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  ⚙ {category}
                </button>
              ))}
            </div>

            {/* Sub-menu of options for active attachment category */}
            {activeCategory && (
              <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(2, 4, 2, 0.95)',
                border: '1px solid var(--cod-primary)',
                padding: '10px',
                zIndex: 20,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px'
              }}>
                <div style={{ gridColumn: 'span 2', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--cod-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>
                  CHOOSE {activeCategory.toUpperCase()} COMPONENT:
                </div>
                {ATTACHMENTS[activeCategory].map(item => {
                  const isActive = attachments[activeCategory].name === item.name;
                  return (
                    <button
                      key={item.name}
                      onMouseEnter={() => setHoveredAttachment({ category: activeCategory, item })}
                      onMouseLeave={() => setHoveredAttachment(null)}
                      onClick={() => handleEquipAttachment(activeCategory, item)}
                      style={{
                        background: isActive ? 'rgba(0, 255, 65, 0.15)' : 'rgba(10, 10, 10, 0.8)',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--cod-primary)' : 'var(--cod-border)',
                        color: isActive ? 'var(--cod-primary)' : 'var(--cod-text)',
                        padding: '6px',
                        fontSize: '0.55rem',
                        fontFamily: 'var(--font-mono)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                      <div style={{ fontSize: '0.45rem', color: 'var(--cod-text-muted)', marginTop: '2px' }}>{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Panel: Spec Stats & Description */}
          <div className="weapon-specs-panel">
            <div className="weapon-specs-header">
              <h2 className="weapon-specs-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span>{selectedWeapon.name}</span>
                <span style={{ fontSize: '0.6rem', color: selectedCamo.color, fontFamily: 'var(--font-mono)' }}>{selectedCamo.name}</span>
              </h2>
              <div className="weapon-specs-desc">{selectedWeapon.desc}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                color: 'var(--cod-text-muted)',
                marginTop: '6px'
              }}>
                {selectedCamo.desc}
              </div>
            </div>

            {/* Dynamic Interactive Stats */}
            <div className="weapon-stats-list">
              {['damage', 'firerate', 'range', 'mobility'].map(stat => {
                const currentVal = getStatVal(stat);
                const previewVal = getPreviewStatVal(stat);
                const delta = previewVal - currentVal;
                
                return (
                  <div key={stat} className="weapon-stat-row">
                    <div className="weapon-stat-info">
                      <span>{stat.toUpperCase()}</span>
                      <span>
                        {currentVal}%
                        {delta > 0 && <span style={{ color: 'var(--cod-primary)', marginLeft: '4px' }}>+{delta}</span>}
                        {delta < 0 && <span style={{ color: 'var(--cod-danger)', marginLeft: '4px' }}>{delta}</span>}
                      </span>
                    </div>
                    
                    <div className="weapon-stat-bar" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                      {/* Base stat fill */}
                      <div 
                        className="weapon-stat-fill" 
                        style={{ width: `${currentVal}%`, position: 'absolute', top: 0, left: 0 }} 
                      />

                      {/* Green delta bar (Improvement) */}
                      {delta > 0 && (
                        <div 
                          style={{
                            height: '100%',
                            background: 'var(--cod-primary)',
                            boxShadow: '0 0 8px var(--cod-primary)',
                            width: `${delta}%`,
                            position: 'absolute',
                            top: 0,
                            left: `${currentVal}%`,
                            animation: 'pulse-glow 1s infinite alternate'
                          }} 
                        />
                      )}

                      {/* Red delta bar (Reduction) */}
                      {delta < 0 && (
                        <div 
                          style={{
                            height: '100%',
                            background: 'var(--cod-danger)',
                            boxShadow: '0 0 8px var(--cod-danger)',
                            width: `${Math.abs(delta)}%`,
                            position: 'absolute',
                            top: 0,
                            left: `${previewVal}%`
                          }} 
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Equip weapon in loadout */}
            <div style={{ marginTop: 'auto' }}>
              <button
                className={`weapon-equip-btn ${isEquipped ? 'equipped' : ''}`}
                onClick={handleEquipWeapon}
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
