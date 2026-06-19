/* ============================================================
   Comms — Decryption Hacking Console & Transceiver
   ============================================================ */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CONFIG from '../../config';
import { playHackingSound, playObjectiveComplete } from '../../utils/audio';

const CHANNELS = [
  { key: 'email', icon: '📧', label: 'Direct Transceiver', getLink: (v) => `mailto:${v}` },
  { key: 'github', icon: '💻', label: 'GitHub Arsenal', getLink: (v) => v },
  { key: 'linkedin', icon: '🔗', label: 'LinkedIn Network', getLink: (v) => v },
  { key: 'twitter', icon: '📢', label: 'Twitter Broadcast', getLink: (v) => v },
  { key: 'medium', icon: '✍️', label: 'Medium Intel Reports', getLink: (v) => v },
];

export default function Comms({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isHacking, setIsHacking] = useState(false);
  const [hackProgress, setHackProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isSent, setIsSent] = useState(false);
  const logContainerRef = useRef(null);

  const HACK_LOGS = [
    'CONNECTING TO SATELLITE TRANSCEIVER GATEWAY...',
    'PINGING SECURE HOST: 141.12.8.254... [OK]',
    'INITIALIZING SSL ENCRYPTION PROTOCOLS...',
    'ENCRYPTING MESSAGE DATA BUFFER... [AES-256]',
    'BYPASSING SECURITY FIREWALL BRIDGES...',
    'ESTABLISHING OUTBOUND TUNNEL...',
    'UPLINK CONNECTED // ROUTING DATA ENVELOPE...',
    'UPLINK SPEED: 480 MBPS // STABLE',
    'TRANSMITTING METADATA... [NAME & EMAIL LOADED]',
    'TRANSMITTING PAYLOAD DATA... [MESSAGE WRITTEN]',
    'SYNCING SECURE CRYPTO KEYS... [SUCCESS]',
    'VERIFYING TRANSMISSION HASH...',
    'TRANSMISSION COMPLETED SUCCESSFULLY.'
  ];

  // Auto scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startHacking = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsHacking(true);
    setLogs([HACK_LOGS[0]]);
    setHackProgress(0);

    let progressStep = 0;
    const progressInterval = setInterval(() => {
      progressStep += 1;
      setHackProgress(progressStep);

      // Play hacking beep sounds
      if (audioEnabled && progressStep % 6 === 0) {
        try { playHackingSound(); } catch (err) {}
      }

      // Add logs periodically
      const logIdx = Math.floor((progressStep / 100) * HACK_LOGS.length);
      setLogs(prev => {
        const nextLog = HACK_LOGS[logIdx];
        if (nextLog && !prev.includes(nextLog)) {
          return [...prev, nextLog];
        }
        return prev;
      });

      if (progressStep >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsHacking(false);
          setIsSent(true);
          if (onCompleteObjective) {
            onCompleteObjective('comms_secure_uplink');
          }
        }, 300);
      }
    }, 45); // ~4.5 seconds decryption sequence
  };

  return (
    <div className="hacking-terminal military-frame">
      <div className="terminal-header-info">
        <div>SYSTEM STATUS: {isHacking ? 'TRANSMITTING...' : isSent ? 'SECURE OUTBOX UPLINKED' : 'AWAITING KEY'}</div>
        <div>UPLINK FREQ: 141.12 MHZ</div>
        <div>OPERATIVE ID: {CONFIG.player.callsign}</div>
      </div>

      <div className="terminal-content">
        <div className="terminal-form-grid">
          {/* Left panel: Transceiver message inputs */}
          <div className="terminal-inputs">
            {!isSent ? (
              <form onSubmit={startHacking} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="terminal-input-group">
                  <label>1. SENDER CALLSIGN / NAME</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter Call Sign..."
                    disabled={isHacking}
                    required
                  />
                </div>
                
                <div className="terminal-input-group">
                  <label>2. TRANSMISSION EMAIL RECEPTOR</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter secure mail..."
                    disabled={isHacking}
                    required
                  />
                </div>

                <div className="terminal-input-group">
                  <label>3. SECURE MESSAGE PAYLOAD</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write encrypted data transmission..."
                    disabled={isHacking}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="terminal-action-btn"
                  disabled={isHacking || !formData.name || !formData.email || !formData.message}
                >
                  {isHacking ? 'DECIPHERING & ROUTING...' : '⚡ INITIATE DATA TRANSMISSION'}
                </button>
              </form>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '30px 20px',
                border: '1px solid var(--cod-primary)',
                background: 'rgba(0, 255, 65, 0.04)',
                fontFamily: 'var(--font-mono)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📡</div>
                <h3 style={{ color: 'var(--cod-primary)', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Uplink Active // Msg Sent
                </h3>
                <p style={{ color: 'var(--cod-text)', fontSize: '0.75rem', marginTop: '10px', lineHeight: '1.6' }}>
                  Your secure transmission has been successfully routed via the orbital relay to {CONFIG.player.realName}. 
                  <br />
                  Intel clearance granted. XP +5000 allocated.
                </p>
                <button 
                  className="terminal-action-btn"
                  style={{ marginTop: '20px', fontSize: '0.65rem' }} 
                  onClick={() => { setIsSent(false); setFormData({ name: '', email: '', message: '' }); }}
                >
                  NEW OUTGOING TRANSMISSION
                </button>
              </div>
            )}
          </div>

          {/* Right panel: Live Encryption logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.55rem', color: 'var(--cod-text-muted)', letterSpacing: '2px' }}>
              SECURE DECRYPTION TERMINAL LOGS
            </div>
            
            <div className="terminal-logs" ref={logContainerRef}>
              {logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.includes('SUCCESS') || log.includes('COMPLETED') ? 'success' : ''}`}>
                  &gt;&gt; {log}
                </div>
              ))}
              {isHacking && (
                <div className="log-entry" style={{ color: 'var(--cod-primary)' }}>
                  &gt;&gt; ROUTING DATA [ {hackProgress}% ]...
                </div>
              )}
              {logs.length === 0 && (
                <div className="log-entry" style={{ color: 'var(--cod-text-dim)' }}>
                  AWAITING MESSAGE INPUT... SYSTEM IDLE
                </div>
              )}
            </div>

            {/* Hacking Progress Bar */}
            {isHacking && (
              <div className="hacking-progress-bar">
                <div className="hacking-progress-fill" style={{ width: `${hackProgress}%` }} />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic classified contact links */}
        {(isSent || completedObjectives.includes('comms_secure_uplink')) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid var(--cod-border)'
            }}
          >
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              color: 'var(--cod-secondary)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              🔓 CLASSIFIED BACK-CHANNEL COMMUNICATIONS UNLOCKED
            </div>
            <div className="comms-channels" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', display: 'grid', gap: '10px' }}>
              {CHANNELS.map((channel) => {
                const value = CONFIG.contact[channel.key];
                if (!value) return null;

                return (
                  <a
                    key={channel.key}
                    className="comms-channel"
                    href={channel.getLink(value)}
                    target={channel.key !== 'email' ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{ margin: 0 }}
                  >
                    <span className="comms-channel-icon">{channel.icon}</span>
                    <div className="comms-channel-info">
                      <div className="comms-channel-label" style={{ fontSize: '0.8rem' }}>{channel.label}</div>
                      <div className="comms-channel-value" style={{ fontSize: '0.6rem' }}>{channel.key === 'email' ? 'Click to compose' : 'Launch link'}</div>
                    </div>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
