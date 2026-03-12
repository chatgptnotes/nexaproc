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
 * ISA 5.1 Bucket Elevator — two pulleys connected vertically with
 * belt/chain running between them, carrying buckets. Motor drives top pulley.
 */
const BucketElevator: React.FC<SymbolProps> = ({
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
        {/* Top head pulley */}
        <circle cx="24" cy="8" r="5" fill="none" stroke={fill} strokeWidth="2" />
        <circle cx="24" cy="8" r="1.5" fill={fill} />
        {isRunning && (
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 8"
              to="360 24 8"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <line x1="24" y1="4" x2="24" y2="12" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3" />
            <line x1="20" y1="8" x2="28" y2="8" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3" />
          </g>
        )}

        {/* Bottom tail pulley */}
        <circle cx="24" cy="40" r="5" fill="none" stroke={fill} strokeWidth="2" />
        <circle cx="24" cy="40" r="1.5" fill={fill} />
        {isRunning && (
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 40"
              to="360 24 40"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <line x1="24" y1="36" x2="24" y2="44" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3" />
            <line x1="20" y1="40" x2="28" y2="40" stroke={fill} strokeWidth="0.6" strokeOpacity="0.3" />
          </g>
        )}

        {/* Left belt/chain (ascending — carrying loaded buckets) */}
        <line x1="19" y1="8" x2="19" y2="40" stroke={fill} strokeWidth="1.8" />

        {/* Right belt/chain (descending — empty buckets) */}
        <line x1="29" y1="8" x2="29" y2="40" stroke={fill} strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Buckets on ascending side (left) */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;0,-8;0,0"
              dur="1.2s"
              repeatCount="indefinite"
            />
          )}
          {/* Bucket 1 */}
          <path d="M 14 16 L 14 20 L 19 20 L 19 16" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1" />
          <line x1="14" y1="16" x2="19" y2="16" stroke={fill} strokeWidth="1.2" />

          {/* Bucket 2 */}
          <path d="M 14 26 L 14 30 L 19 30 L 19 26" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1" />
          <line x1="14" y1="26" x2="19" y2="26" stroke={fill} strokeWidth="1.2" />

          {/* Bucket 3 */}
          <path d="M 14 36 L 14 40 L 19 40 L 19 36" fill={fill} fillOpacity="0.2" stroke={fill} strokeWidth="1" />
          <line x1="14" y1="36" x2="19" y2="36" stroke={fill} strokeWidth="1.2" />
        </g>

        {/* Empty buckets on descending side (right) — inverted */}
        <path d="M 29 18 L 34 18 L 34 22 L 29 22" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />
        <path d="M 29 28 L 34 28 L 34 32 L 29 32" fill="none" stroke={fill} strokeWidth="0.8" strokeOpacity="0.4" />

        {/* Casing outline */}
        <rect x="12" y="3" width="24" height="42" rx="2" fill="none" stroke={fill} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3,2" />

        {/* Motor on top pulley */}
        <line x1="29" y1="8" x2="38" y2="8" stroke={fill} strokeWidth="1.5" />
        <circle cx="42" cy="8" r="4" fill="none" stroke={fill} strokeWidth="1.5" />
        <text x="42" y="10" textAnchor="middle" fill={fill} fontSize="4" fontFamily="Arial, sans-serif" fontWeight="bold">M</text>

        {/* Feed inlet — bottom left */}
        <line x1="2" y1="38" x2="12" y2="38" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="6,36 10,38 6,40" fill={fill} fillOpacity="0.4" />

        {/* Discharge — top right */}
        <line x1="36" y1="6" x2="36" y2="2" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="36" y1="2" x2="46" y2="2" stroke={fill} strokeWidth="1.5" strokeLinecap="round" />
        <polygon points="40,0 42,2 40,4" fill={fill} fillOpacity="0.4" />

        {/* Upward flow arrow */}
        <polygon points="17,24 19,20 21,24" fill={fill} fillOpacity="0.2" />
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

export default BucketElevator;
