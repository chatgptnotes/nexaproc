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
 * ISA 5.1 Turbine — circle housing with curved turbine blades inside.
 * Steam/gas inlet on left, exhaust on right, shaft output on bottom.
 */
const Turbine: React.FC<SymbolProps> = ({
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

  // Generate turbine blade paths
  const bladeCount = 8;
  const blades: string[] = [];
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2;
    const x1 = 24 + 4 * Math.cos(angle);
    const y1 = 24 + 4 * Math.sin(angle);
    const x2 = 24 + 11 * Math.cos(angle + 0.3);
    const y2 = 24 + 11 * Math.sin(angle + 0.3);
    const cx = 24 + 8 * Math.cos(angle - 0.2);
    const cy = 24 + 8 * Math.sin(angle - 0.2);
    blades.push(`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
  }

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
        {/* Steam/gas inlet — left side */}
        <line x1="0" y1="20" x2="10" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="7,18 11,20 7,22" fill={fill} fillOpacity="0.5" />

        {/* Exhaust outlet — right side */}
        <line x1="38" y1="20" x2="48" y2="20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Turbine housing circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Curved turbine blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="0.8s"
              repeatCount="indefinite"
            />
          )}
          {blades.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={fill}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
          {/* Hub */}
          <circle cx="24" cy="24" r="4" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="1.5" fill={fill} />
        </g>

        {/* Shaft output — bottom */}
        <line x1="24" y1="37" x2="24" y2="46" stroke={fill} strokeWidth="3" strokeLinecap="round" />
        {/* Coupling */}
        <rect x="21.5" y="42" width="5" height="3" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="0.8" rx="0.5" />

        {/* Casing flanges */}
        <line x1="10" y1="17" x2="10" y2="23" stroke={fill} strokeWidth="1.5" />
        <line x1="38" y1="17" x2="38" y2="23" stroke={fill} strokeWidth="1.5" />

        {/* "T" indicator */}
        <text
          x="24"
          y="10"
          textAnchor="middle"
          fill={fill}
          fontSize="6"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fillOpacity="0.5"
        >
          T
        </text>
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

export default Turbine;
