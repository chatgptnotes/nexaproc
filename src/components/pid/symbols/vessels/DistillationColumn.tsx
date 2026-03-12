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
 * Distillation Column — ISA P&ID Standard
 * Tall vertical column with trays (horizontal lines inside), top condenser
 * connection, bottom reboiler connection, feed inlet, and product outlets.
 */
const DistillationColumn: React.FC<SymbolProps> = ({
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

  // Column dimensions — tall narrow vessel
  const cL = 16;
  const cR = 32;
  const cW = cR - cL;
  const cTop = 4;
  const cBot = 44;
  const headRy = 3;

  const totalBot = cBot + headRy;
  const totalTop = cTop - headRy;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  // Column outline with dished heads
  const columnPath = `
    M ${cL},${cTop}
    A ${cW / 2},${headRy} 0 0,1 ${cR},${cTop}
    L ${cR},${cBot}
    A ${cW / 2},${headRy} 0 0,1 ${cL},${cBot}
    Z
  `;

  // Tray positions (evenly spaced)
  const trays = [11, 16, 21, 26, 31, 36, 41];

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-distillation-column ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`distColClip-${size}`}>
          <path d={columnPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#distColClip-${size})`}>
            <rect
              x={cL - 1}
              y={liquidY}
              width={cW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
          </g>
        )}

        {/* Column body outline */}
        <path d={columnPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Internal trays (horizontal lines) */}
        {trays.map((y, i) => (
          <line
            key={i}
            x1={cL + 1.5}
            y1={y}
            x2={cR - 1.5}
            y2={y}
            stroke={stroke}
            strokeWidth="0.7"
            strokeDasharray={i % 2 === 0 ? '2,1' : 'none'}
          />
        ))}

        {/* Downcomer segments (alternating sides) */}
        {trays.slice(0, -1).map((y, i) => {
          const x = i % 2 === 0 ? cR - 3 : cL + 3;
          return (
            <line
              key={`dc-${i}`}
              x1={x}
              y1={y}
              x2={x}
              y2={y + 3}
              stroke={stroke}
              strokeWidth="0.5"
            />
          );
        })}

        {/* Top vapor outlet to condenser */}
        <line x1={24} y1={cTop - headRy} x2={24} y2={0} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Condenser connection (small circle) */}
        <circle cx={24} cy={0} r="0" fill="none" />

        {/* Reflux return (left top) */}
        <line x1={8} y1={8} x2={cL} y2={8} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="8,7 6,8 8,9" fill={stroke} />

        {/* Feed inlet (left middle) */}
        <line x1={6} y1={24} x2={cL} y2={24} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={6} cy={24} r="1" fill={stroke} />

        {/* Side draw (right) */}
        <line x1={cR} y1={18} x2={42} y2={18} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Bottom product outlet */}
        <line x1={cR} y1={40} x2={42} y2={40} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={42} cy={40} r="1" fill={stroke} />

        {/* Reboiler return (right bottom) */}
        <line x1={cR} y1={44} x2={40} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Vapor rising animation */}
        {isRunning && (
          <g clipPath={`url(#distColClip-${size})`}>
            {[20, 24, 28].map((x, i) => (
              <circle key={`bubble-${i}`} cx={x} cy={38} r="0.8" fill={stroke} opacity="0.5">
                <animate
                  attributeName="cy"
                  values="38;8"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.5;0"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="6.5"
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

export default DistillationColumn;
