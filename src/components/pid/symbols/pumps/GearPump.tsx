import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  running: '#4ade80',
  stopped: '#6b7280',
  fault: '#ef4444',
  maintenance: '#38bdf8',
  standby: '#fbbf24',
  offline: '#374151',
};

/**
 * ISA 5.1 Gear Pump — circle body with two interlocking gear wheels inside.
 */
const GearPump: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  color,
  label,
  animated = false,
  rotation = 0,
  className,
  onClick,
}) => {
  const fill = color ?? STATE_COLORS[state] ?? STATE_COLORS.stopped;
  const isRunning = animated && state === 'running';

  // Generate gear tooth path for a gear centered at (cx,cy)
  const gearPath = (cx: number, cy: number, innerR: number, outerR: number, teeth: number) => {
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2 - Math.PI / 2;
      const a2 = ((i + 0.35) / teeth) * Math.PI * 2 - Math.PI / 2;
      const a3 = ((i + 0.5) / teeth) * Math.PI * 2 - Math.PI / 2;
      const a4 = ((i + 0.85) / teeth) * Math.PI * 2 - Math.PI / 2;

      pts.push(`${cx + innerR * Math.cos(a1)},${cy + innerR * Math.sin(a1)}`);
      pts.push(`${cx + outerR * Math.cos(a2)},${cy + outerR * Math.sin(a2)}`);
      pts.push(`${cx + outerR * Math.cos(a3)},${cy + outerR * Math.sin(a3)}`);
      pts.push(`${cx + innerR * Math.cos(a4)},${cy + innerR * Math.sin(a4)}`);
    }
    return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
  };

  return (
    <svg
      width={size}
      height={label ? size * 1.35 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet pipe */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="20" x2="10" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge pipe */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="20" x2="38" y2="28" stroke={fill} strokeWidth="1.5" />

        {/* Discharge triangle */}
        <polygon
          points="34,18 41,24 34,30"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Main body circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Two interlocking gears */}
        {/* Left gear */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 20 24"
              to="360 20 24"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <path
            d={gearPath(20, 24, 3.5, 5.5, 6)}
            fill={fill}
            fillOpacity="0.2"
            stroke={fill}
            strokeWidth="1"
          />
          <circle cx="20" cy="24" r="1.5" fill={fill} />
        </g>

        {/* Right gear — counter-rotating */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 28 24"
              to="0 28 24"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          <path
            d={gearPath(28, 24, 3.5, 5.5, 6)}
            fill={fill}
            fillOpacity="0.2"
            stroke={fill}
            strokeWidth="1"
          />
          <circle cx="28" cy="24" r="1.5" fill={fill} />
        </g>
      </g>

      {label && (
        <text
          x="24"
          y="56"
          textAnchor="middle"
          fill={fill}
          fontSize="7"
          fontFamily="Arial, sans-serif"
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default GearPump;
