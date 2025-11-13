const NeonLogo = () => {
  return (
    <div className="logo-container">
      <svg
        width="36"
        height="36"
        viewBox="0 0 470 470"
        xmlns="http://www.w3.org/2000/svg"
        className="neon-icon"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a3ff00" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lightning" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="2"
              seed="5"
            />
            <feDisplacementMap in="SourceGraphic" scale="5" />
          </filter>
        </defs>
        <path
          filter="url(#neon-glow)"
          style={{ fill: "url(#gradient)" }}
          d="M235,30 L190,30 L190,60 L210,90 L180,120 L200,150 L170,200 L190,250 L160,300 L180,350 L150,400 L320,400 L290,350 L310,300 L280,250 L300,200 L270,150 L290,120 L260,90 L280,60 L280,30 Z"
        />
        <path
          className="lightning"
          filter="url(#lightning)"
          style={{ fill: "#ffffff", opacity: 0.7 }}
          d="M235,30 L215,120 L245,140 L225,250 L255,270 L235,400"
        />
      </svg>
      <div className="text-container">
        <span className="neon-text">NeonGambit</span>
      </div>
      <style jsx>{`
        .logo-container {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 40px;
        }
        .text-container {
          overflow: hidden;
        }
        .neon-text {
          font-family: "Arial Black", sans-serif;
          font-size: 1.25rem;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #a3ff00, #00ff88);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 5px rgba(163, 255, 0, 0.5),
            0 0 10px rgba(0, 255, 136, 0.3);
          position: relative;
          white-space: nowrap;
        }
        .neon-icon {
          filter: drop-shadow(0 0 4px #a3ff0088) drop-shadow(0 0 8px #00ff8866);
          animation: icon-pulse 3s ease-in-out infinite,
            lightning-flash 7s infinite;
        }
        @keyframes icon-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.95;
          }
        }
        @keyframes lightning-flash {
          0%,
          95%,
          98%,
          100% {
            opacity: 0.7;
            filter: brightness(1);
          }
          96%,
          99% {
            opacity: 1;
            filter: brightness(1.5);
          }
        }
        .lightning {
          animation: lightning-flash 7s infinite;
        }
        .logo-container:hover .neon-icon {
          animation: icon-pulse 0.8s ease-in-out infinite,
            lightning-flash 1.5s infinite;
        }
        .logo-container:hover .neon-text {
          animation: text-flicker 1.5s infinite;
        }
        @keyframes text-flicker {
          0%,
          92%,
          96%,
          100% {
            opacity: 1;
            text-shadow: 0 0 5px rgba(163, 255, 0, 0.5),
              0 0 10px rgba(0, 255, 136, 0.3);
          }
          94%,
          98% {
            opacity: 0.8;
            text-shadow: 0 0 3px rgba(163, 255, 0, 0.3),
              0 0 5px rgba(0, 255, 136, 0.2);
          }
        }
      `}</style>
    </div>
  );
};

export default NeonLogo;
