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
 * ISA 5.1 Belt Conveyor — two circles (head and tail pulleys/rollers)
 * connected by top and bottom belt lines. Motor drives the head pulley.
 */
const Conveyor: React.FC<SymbolProps> = ({
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
        {/* Tail pulley (left) */}
        <circle cx="10" cy="24" r="6" fill="none" stroke={fill} strokeWidth="2" />
        <circle cx="10" cy="24" r="1.5" fill={fill} />

        {/* Head pulley (right — drive end) */}
        <circle cx="38" cy="24" r="6" fill="none" stroke={fill} strokeWidth="2" />
        <circle cx="38" cy="24" r="1.5" fill={fill} />

        {/* Top belt line */}
        <line x1="10" y1="18" x2="38" y2="18" stroke={fill} strokeWidth="2.5" />
        {/* Bottom belt line */}
        <line x1="10" y1="30" x2="38" y2="30" stroke={fill} strokeWidth="2" strokeOpacity="0.6" />

        {/* Belt chevrons (movement indicators) */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;6,0;0,0"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          <polygon points="16,17 18,15 20,17" fill={fill} fillOpacity="0.3" />
          <polygon points="24,17 26,15 28,17" fill={fill} fillOpacity="0.3" />
          <polygon points="32,17 34,15 36,17" fill={fill} fillOpacity="0.3" />
        </g>

        {/* Roller rotation indicators when running */}
        {isRunning && (
          <>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 10 24"
                to="360 10 24"
                dur="1s"
                repeatCount="indefinite"
              />
              <line x1="10" y1="19" x2="10" y2="29" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="5" y1="24" x2="15" y2="24" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 38 24"
                to="360 38 24"
                dur="1s"
                repeatCount="indefinite"
              />
              <line x1="38" y1="19" x2="38" y2="29" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
              <line x1="33" y1="24" x2="43" y2="24" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
            </g>
          </>
        )}

        {/* Motor on head pulley */}
        <line x1="38" y1="18" x2="38" y2="10" stroke={fill} strokeWidth="1.5" />
        <circle cx="38" cy="7" r="4" fill="none" stroke={fill} strokeWidth="1.5" />
        <text x="38" y="9" textAnchor="middle" fill={fill} fontSize="4" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>

        {/* Support legs */}
        <line x1="10" y1="30" x2="10" y2="36" stroke={fill} strokeWidth="1.5" />
        <line x1="24" y1="30" x2="24" y2="36" stroke={fill} strokeWidth="1" strokeOpacity="0.5" />
        <line x1="38" y1="30" x2="38" y2="36" stroke={fill} strokeWidth="1.5" />
        {/* Base line */}
        <line x1="6" y1="36" x2="42" y2="36" stroke={fill} strokeWidth="1.5" />

        {/* Direction arrow */}
        <polygon points="30,14 34,12 34,16" fill={fill} fillOpacity="0.4" />
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

export default Conveyor;
