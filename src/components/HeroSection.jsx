import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Typewriter } from './Typewriter';
import { CodeRainIdentity } from './CodeRainIdentity';
import '../styles/hero.css';

const BOOT_LINES = [
  'INIT: NAVCOM LINK .......... OK',
  'INIT: RENDER CORE .......... ONLINE',
  'INIT: PROFILE MODULE ....... SAHIL_SALAP',
];

const MagneticButton = ({ children, variant = 'primary' }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    // Magnetic effect radius
    const magneticRadius = 100;
    
    if (distance < magneticRadius) {
      const force = 1 - distance / magneticRadius;
      const safeDistance = Math.max(distance, 1);
      setPosition({
        x: (distX / safeDistance) * force * 20,
        y: (distY / safeDistance) * force * 20,
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const baseClass = 'px-8 py-3 font-body font-semibold uppercase tracking-wide transition-all duration-300 text-sm';
  
  const primaryClass = `${baseClass} bg-accent text-bg border border-accent hover:shadow-lg hover:shadow-accent/50`;
  const ghostClass = `${baseClass} border border-accent text-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/30`;

  return (
    <motion.button
      ref={buttonRef}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseLeave={handleMouseLeave}
      className={variant === 'primary' ? primaryClass : ghostClass}
    >
      {children}
    </motion.button>
  );
};

export const HeroSection = () => {
  const shellVariants = {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: 'easeOut',
        staggerChildren: 0.15,
        delayChildren: 0.18,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const glitchVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="hero-container">
      <div className="hero-scanlines" aria-hidden="true" />

      <motion.div
        className="hero-shell"
        variants={shellVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="hero-bootbar">
          <span>SHIP://PORTFOLIO_BOOT</span>
          <span>MODE: TERMINAL</span>
          <span>STATUS: ONLINE</span>
        </motion.div>

        <div className="hero-content">
          {/* Left Side - 60% */}
          <motion.div className="hero-left" variants={itemVariants}>
            <motion.p variants={itemVariants} className="hero-prompt">
              {'>'} run profile --target sahil_salap
            </motion.p>

            <motion.div variants={glitchVariants} className="hero-name-wrapper">
              <h1 className="hero-name glitch" data-text="SAHIL">
                SAHIL
              </h1>
              <h1 className="hero-name glitch" data-text="SALAP">
                SALAP
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="hero-subtitle">
              <Typewriter />
            </motion.div>

            <motion.p variants={itemVariants} className="hero-info">
              B.E. Computer Engineering · CGPA 9.09 · Class of 2027
            </motion.p>

            <motion.div variants={itemVariants} className="hero-buttons">
              <MagneticButton variant="primary">View Projects</MagneticButton>
              <MagneticButton variant="ghost">Download Resume</MagneticButton>
            </motion.div>

            <motion.ul variants={itemVariants} className="hero-bootlog">
              {BOOT_LINES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right Side - 40% - Code Rain Identity Canvas */}
          <motion.div className="hero-right" variants={itemVariants}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <CodeRainIdentity />
            </div>
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'rgba(0,255,135,0.3)',
                textAlign: 'center',
                marginTop: '8px',
              }}
            >
              [ HOVER TO ASSEMBLE ]
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
