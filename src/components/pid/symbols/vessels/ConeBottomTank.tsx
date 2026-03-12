import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby' | 'offline';
  fillLevel?: number;
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  running: '#4ade80',
  stopped: '#ef4444',
  fault: '#f97316',
  maintenance: '#fbbf24',
  standby: '#38bdf8',
  offline: '#6b7280',
};

const LIQUID_COLORS: Record<string, string> = {
  running: '#4ade8040',
  stopped: '#ef444440',
  fault: '#f9731640',
  maintenance: '#fbbf2440',
  standby: '#38bdf840',
  offline: '#6b728040',
};

/**
 * Cone Bottom Tank — P&ID Standard
 * Cylindrical tank with conical bottom for complete drainage.
 * Flat top with vent, conical discharge at bottom center.
 */
const ConeBottomTank: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  fillLevel = 0,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const liquidColor = color ? `${color}40` : LIQUID_COLORS[state] || LIQUID_COLORS.offline;
  const isFault = state === 'fault';
  const isRunning = state === 'running' && animated;
  const level = Math.max(0, Math.min(100, fillLevel));

  // Tank dimensions
  const tL = 10;
  const tR = 38;
  const tW = tR - tL;
  const tTop = 6;
  const coneStart = 30; // Where cone begins (cylinder bottom)
  const coneBot = 42; // Cone tip
  const center = 24;

  // Tank outline
  const tankPath = `
    M ${tL},${tTop}
    L ${tR},${tTop}
    L ${tR},${coneStart}
    L ${center},${coneBot}
    L ${tL},${coneStart}
    Z
  `;

  const totalH = coneBot - tTop;
  const liquidTop = coneBot - (totalH * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-cone-bottom-tank ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
      <defs>
        <clipPath id={`cbtClip-${size}`}>
          <path d={tankPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#cbtClip-${size})`}>
            <rect
              x={tL - 1}
              y={liquidTop}
              width={tW + 2}
              height={coneBot - liquidTop + 1}
              fill={liquidColor}
            />
            {isRunning ? (
              <path
                d={`M${tL},${liquidTop} Q24,${liquidTop - 1.5} ${tR},${liquidTop}`}
                stroke={stroke}
                strokeWidth="0.6"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${tL},${liquidTop} Q24,${liquidTop - 1.5} ${tR},${liquidTop};M${tL},${liquidTop} Q24,${liquidTop + 1.5} ${tR},${liquidTop};M${tL},${liquidTop} Q24,${liquidTop - 1.5} ${tR},${liquidTop}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={tL} y1={liquidTop} x2={tR} y2={liquidTop} stroke={stroke} strokeWidth="0.6" />
            )}
          </g>
        )}

        {/* Tank body */}
        <path d={tankPath} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />

        {/* Top plate */}
        <line x1={tL - 2} y1={tTop} x2={tR + 2} y2={tTop} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Vent on top */}
        <line x1={24} y1={tTop} x2={24} y2={2} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={22} y1={2} x2={26} y2={2} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Inlet nozzle (left upper) */}
        <line x1={2} y1={14} x2={tL} y2={14} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={2} cy={14} r="1" fill={stroke} />

        {/* Overflow nozzle (right upper) */}
        <line x1={tR} y1={12} x2={46} y2={12} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Discharge nozzle (cone bottom) */}
        <line x1={center} y1={coneBot} x2={center} y2={46} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={center} cy={46} r="1" fill={stroke} />

        {/* Discharge valve indicator */}
        <polygon points="22,44 24,42.5 26,44" fill="none" stroke={stroke} strokeWidth="0.8" />

        {/* Support legs */}
        <line x1={tL} y1={coneStart} x2={tL - 4} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={tR} y1={coneStart} x2={tR + 4} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Level sight glass (right side) */}
        <line x1={tR + 1} y1={tTop + 3} x2={tR + 1} y2={coneStart - 2} stroke={stroke} strokeWidth="0.5" />
        <line x1={tR} y1={tTop + 3} x2={tR + 2} y2={tTop + 3} stroke={stroke} strokeWidth="0.4" />
        <line x1={tR} y1={coneStart - 2} x2={tR + 2} y2={coneStart - 2} stroke={stroke} strokeWidth="0.4" />
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fill={stroke}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default ConeBottomTank;
