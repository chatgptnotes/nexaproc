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
 * Reboiler — P&ID Standard (Kettle Type)
 * Shell and tube at bottom of distillation column. Kettle type has an
 * enlarged shell (wider than tube bundle side) with a weir inside.
 * Horizontal orientation with shell-side boiling and tube-side heating.
 */
const Reboiler: React.FC<SymbolProps> = ({
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

  // Kettle reboiler: enlarged shell on left, narrower tube section on right
  // Horizontal vessel with egg-shaped profile
  const shellCy = 24;
  const shellRx = 14; // Horizontal radius of enlarged shell
  const shellRy = 12; // Vertical radius — enlarged
  const tubeBodyLeft = 24;
  const tubeBodyRight = 42;
  const tubeRy = 7; // Tube section narrower

  // Kettle shell outline
  const kettlePath = `
    M ${tubeBodyRight},${shellCy - tubeRy}
    L ${tubeBodyLeft},${shellCy - tubeRy}
    Q ${tubeBodyLeft - 4},${shellCy - tubeRy} ${tubeBodyLeft - 6},${shellCy - shellRy + 2}
    A ${shellRx},${shellRy} 0 0,0 ${tubeBodyLeft - 6},${shellCy + shellRy - 2}
    Q ${tubeBodyLeft - 4},${shellCy + tubeRy} ${tubeBodyLeft},${shellCy + tubeRy}
    L ${tubeBodyRight},${shellCy + tubeRy}
    A ${4},${tubeRy} 0 0,0 ${tubeBodyRight},${shellCy - tubeRy}
    Z
  `;

  const liquidTop = shellCy + shellRy - 2 - ((shellRy * 2 - 4) * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-reboiler ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`rebClip-${size}`}>
          <path d={kettlePath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#rebClip-${size})`}>
            <rect
              x={0}
              y={liquidTop}
              width={48}
              height={shellCy + shellRy - liquidTop}
              fill={liquidColor}
            />
            <line x1={4} y1={liquidTop} x2={46} y2={liquidTop} stroke={stroke} strokeWidth="0.5" />
          </g>
        )}

        {/* Kettle shell body */}
        <path d={kettlePath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Tube bundle (horizontal lines through tube section) */}
        <line x1={24} y1={shellCy - 3} x2={46} y2={shellCy - 3} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={24} y1={shellCy + 3} x2={46} y2={shellCy + 3} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Tube sheet (vertical line separating enlarged shell from tube section) */}
        <line x1={24} y1={shellCy - tubeRy} x2={24} y2={shellCy + tubeRy} stroke={stroke} strokeWidth="1.5" />

        {/* Weir inside enlarged shell (vertical plate for liquid level control) */}
        <line x1={14} y1={shellCy - 4} x2={14} y2={shellCy + shellRy - 4} stroke={stroke} strokeWidth="1" strokeLinecap="round" />

        {/* Feed inlet (left — liquid from column bottom) */}
        <line x1={0} y1={shellCy + 4} x2={8} y2={shellCy + 4} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={1} cy={shellCy + 4} r="1" fill={stroke} />

        {/* Vapor return to column (top of enlarged shell) */}
        <line x1={12} y1={shellCy - shellRy + 2} x2={12} y2={6} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="11,7 12,5 13,7" fill={stroke} />

        {/* Heating medium inlet (right — tubes) */}
        <line x1={46} y1={shellCy - 3} x2={48} y2={shellCy - 3} stroke={stroke} strokeWidth="1.2" />
        <circle cx={47} cy={shellCy - 3} r="0.8" fill={stroke} />

        {/* Heating medium outlet (right — tubes) */}
        <line x1={46} y1={shellCy + 3} x2={48} y2={shellCy + 3} stroke={stroke} strokeWidth="1.2" />
        <circle cx={47} cy={shellCy + 3} r="0.8" fill={stroke} />

        {/* Bottoms product (left bottom, past weir) */}
        <line x1={8} y1={shellCy + shellRy - 3} x2={0} y2={shellCy + shellRy + 2} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <circle cx={1} cy={shellCy + shellRy + 2} r="0.8" fill={stroke} />

        {/* Boiling animation — bubbles rising in enlarged shell */}
        {isRunning && (
          <g clipPath={`url(#rebClip-${size})`}>
            {[8, 12, 16, 20].map((x, i) => (
              <circle key={i} cx={x} cy={shellCy + 6} r="0.6" fill={stroke} opacity="0.3">
                <animate
                  attributeName="cy"
                  values={`${shellCy + 6};${shellCy - shellRy + 4}`}
                  dur={`${1.2 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0"
                  dur={`${1.2 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* Support saddles */}
        <path d={`M12,${shellCy + shellRy - 1} L10,${shellCy + shellRy + 5} L14,${shellCy + shellRy + 5} Z`} fill="none" stroke={stroke} strokeWidth="0.8" />
        <path d={`M34,${shellCy + tubeRy} L32,${shellCy + tubeRy + 5} L36,${shellCy + tubeRy + 5} Z`} fill="none" stroke={stroke} strokeWidth="0.8" />
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

export default Reboiler;
