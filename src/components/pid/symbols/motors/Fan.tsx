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
 * ISA 5.1 Fan — circle with multi-blade axial fan shape.
 * 5 evenly-spaced airfoil blades radiating from center hub.
 */
const Fan: React.FC<SymbolProps> = ({
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

  // Generate 5 fan blade paths
  const bladeCount = 5;
  const blades: string[] = [];
  for (let i = 0; i < bladeCount; i++) {
    const angle = (i / bladeCount) * Math.PI * 2 - Math.PI / 2;
    const tipAngle = angle + 0.15;
    // Blade root
    const rx = 24 + 3 * Math.cos(angle);
    const ry = 24 + 3 * Math.sin(angle);
    // Blade tip
    const tx = 24 + 11 * Math.cos(tipAngle);
    const ty = 24 + 11 * Math.sin(tipAngle);
    // Control points for airfoil shape
    const c1x = 24 + 7 * Math.cos(angle - 0.25);
    const c1y = 24 + 7 * Math.sin(angle - 0.25);
    const c2x = 24 + 7 * Math.cos(angle + 0.35);
    const c2y = 24 + 7 * Math.sin(angle + 0.35);

    blades.push(
      `M ${rx} ${ry} Q ${c1x} ${c1y} ${tx} ${ty} Q ${c2x} ${c2y} ${rx} ${ry} Z`
    );
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
        {/* Duct inlet — left */}
        <line x1="0" y1="24" x2="10" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="5,22 9,24 5,26" fill={fill} fillOpacity="0.4" />

        {/* Duct outlet — right */}
        <line x1="38" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Fan housing circle */}
        <circle cx="24" cy="24" r="13" fill="none" stroke={fill} strokeWidth="2.5" />

        {/* Fan blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
          {blades.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={fill}
              fillOpacity="0.2"
              stroke={fill}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          ))}
          {/* Hub */}
          <circle cx="24" cy="24" r="3.5" fill={fill} fillOpacity="0.3" stroke={fill} strokeWidth="1.5" />
          <circle cx="24" cy="24" r="1.5" fill={fill} />
        </g>

        {/* Motor connection — top */}
        <line x1="24" y1="11" x2="24" y2="5" stroke={fill} strokeWidth="2" strokeLinecap="round" />
        <rect x="20" y="1" width="8" height="5" rx="1" fill="none" stroke={fill} strokeWidth="1.2" />
        <text x="24" y="5" textAnchor="middle" fill={fill} fontSize="3.5" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>

        {/* Air flow lines when running */}
        {isRunning && (
          <g>
            <line x1="40" y1="20" x2="46" y2="18" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3">
              <animate attributeName="x2" values="46;48;46" dur="0.8s" repeatCount="indefinite" />
            </line>
            <line x1="40" y1="28" x2="46" y2="30" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3">
              <animate attributeName="x2" values="46;48;46" dur="0.8s" repeatCount="indefinite" />
            </line>
          </g>
        )}
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

export default Fan;
