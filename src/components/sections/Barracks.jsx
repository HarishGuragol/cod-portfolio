/* ============================================================
   Barracks — Education & Training Records
   ============================================================ */
import { useState } from 'react';
import { motion } from 'framer-motion';
import CONFIG from '../../config';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Barracks({ audioEnabled, onCompleteObjective, completedObjectives = [] }) {
  const [visitedCerts, setVisitedCerts] = useState(new Set());

  const handleCertHover = (index) => {
    setVisitedCerts(prev => {
      const next = new Set(prev);
      next.add(index);
      // If they verify at least 2 certificates, complete objective
      if (next.size >= 2 && onCompleteObjective) {
        onCompleteObjective('barracks_inspect_certs');
      }
      return next;
    });
  };

  return (
    <motion.div
      className="training-records"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      {CONFIG.education.map((edu, i) => (
        <motion.div key={i} variants={fadeUp}>
          {edu.degree ? (
            /* Education Record */
            <div className="training-record military-frame">
              <div className="training-program">{edu.program}</div>
              <h3 className="training-degree">{edu.degree}</h3>
              <p className="training-field">{edu.field}</p>
              <p className="training-institution">{edu.institution}</p>
              <div className="training-period">{edu.period}</div>
              {edu.gpa && (
                <div className="training-gpa">GPA: {edu.gpa}</div>
              )}
            </div>
          ) : (
            /* Certifications */
            <div>
              <div className="training-record military-frame" style={{ marginBottom: '16px' }}>
                <div className="training-program">{edu.program}</div>
                <h3 className="training-degree" style={{ fontSize: '1.3rem' }}>
                  SPECIALIST QUALIFICATIONS
                  <span style={{ fontSize: '0.6rem', color: 'var(--cod-warning)', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>
                    ({visitedCerts.size} / {edu.certifications?.length || 0} BADGES SECURED)
                  </span>
                </h3>
              </div>
              
              <div className="cert-grid">
                {edu.certifications?.map((cert, j) => (
                  <motion.div
                    key={j}
                    className={`cert-card ${visitedCerts.has(j) ? 'cert-secured' : ''}`}
                    variants={fadeUp}
                    onMouseEnter={() => handleCertHover(j)}
                    style={{
                      borderColor: visitedCerts.has(j) ? 'var(--cod-warning)' : 'var(--cod-border)',
                      background: visitedCerts.has(j) ? 'rgba(255, 170, 0, 0.05)' : 'rgba(10, 10, 10, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span className="cert-badge">{cert.badge}</span>
                    <div className="cert-info">
                      <div className="cert-name" style={{ color: visitedCerts.has(j) ? 'var(--cod-text-bright)' : 'var(--cod-text)' }}>
                        {cert.name}
                      </div>
                      <div className="cert-year">EARNED: {cert.year}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
