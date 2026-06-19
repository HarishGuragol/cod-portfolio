/* ============================================================
   Crosshair — Custom animated targeting cursor
   Reacts to interactive elements like aiming at targets
   ============================================================ */
import { useState, useEffect, useRef } from 'react';

export default function Crosshair() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isTarget, setIsTarget] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [impacts, setImpacts] = useState([]);
  const impactId = useRef(0);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over interactive element
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const interactive = el.closest('button, a, .project-card, .skill-card, .timeline-item, .comms-channel, .cert-card, .menu-nav-btn');
        setIsTarget(!!interactive);
      }
    };

    const handleClick = (e) => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 150);
      
      // Add bullet impact
      const id = impactId.current++;
      setImpacts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setImpacts(prev => prev.filter(i => i.id !== id));
      }, 600);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* Crosshair */}
      <div
        className={`crosshair ${isTarget ? 'crosshair-target' : ''} ${isClicked ? 'crosshair-fire' : ''}`}
        style={{ left: pos.x, top: pos.y }}
      >
        <div className="crosshair-line crosshair-top" />
        <div className="crosshair-line crosshair-right" />
        <div className="crosshair-line crosshair-bottom" />
        <div className="crosshair-line crosshair-left" />
        <div className="crosshair-dot" />
        {isTarget && <div className="crosshair-diamond" />}
      </div>

      {/* Bullet impacts */}
      {impacts.map(impact => (
        <div
          key={impact.id}
          className="bullet-impact"
          style={{ left: impact.x, top: impact.y }}
        >
          <div className="impact-flash" />
          <div className="impact-ring" />
          <div className="impact-sparks">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="spark" style={{
                '--angle': `${i * 60 + Math.random() * 30}deg`,
                '--distance': `${20 + Math.random() * 30}px`,
                '--delay': `${Math.random() * 0.1}s`,
              }} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
