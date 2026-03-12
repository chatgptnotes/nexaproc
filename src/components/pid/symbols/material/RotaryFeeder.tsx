import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'active' | 'inactive' | 'fault' | 'offline';
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  active: '#4ade80',
  inactive: '#6b7280',
  fault: '#ef4444',
  offline: '#374151',
};

/**
 * Rotary Feeder — Star/rotary valve: circle with radial vanes.
 * Also known as rotary airlock valve. Vanes rotate when animated.
 */
const RotaryFeeder: React.FC<SymbolProps> = ({
  size = 48,
  state = 'active',
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const fill = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';
  const vaneCount = 6;

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-material pid-rotary-feeder ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inlet port — top */}
        <rect x="18" y="2" width="12" height="6" fill="none" stroke={fill} strokeWidth="1.5" />
        <line x1="20" y1="2" x2="20" y2="0" stroke={fill} strokeWidth="1.5" />
        <line x1="28" y1="2" x2="28" y2="0" stroke={fill} strokeWidth="1.5" />

        {/* Housing — outer circle */}
        <circle cx="24" cy="24" r="14" fill="none" stroke={fill} strokeWidth="2" />

        {/* Rotor with vanes */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
          {/* Central hub */}
          <circle cx="24" cy="24" r="3" fill={fill} opacity="0.4" stroke={fill} strokeWidth="1" />
          {/* Radial vanes */}
          {Array.from({ length: vaneCount }, (_, i) => {
            const angle = (i * 360) / vaneCount;
            const rad = (angle * Math.PI) / 180;
            const x2 = 24 + 13 * Math.cos(rad);
            const y2 = 24 + 13 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="24" y1="24"
                x2={x2} y2={y2}
                stroke={fill}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Discharge port — bottom */}
        <rect x="18" y="40" width="12" height="6" fill="none" stroke={fill} strokeWidth="1.5" />
        <line x1="20" y1="46" x2="20" y2="48" stroke={fill} strokeWidth="1.5" />
        <line x1="28" y1="46" x2="28" y2="48" stroke={fill} strokeWidth="1.5" />

        {/* Flow arrows */}
        <polygon points="22,3 24,0 26,3" fill={fill} opacity="0.5" />
        <polygon points="22,45 24,48 26,45" fill={fill} opacity="0.5" />
      </g>
      {label && (
        <text x="24" y="58" textAnchor="middle" fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif" fill={fill} fontWeight="600">
          {label}
        </text>
      )}
    </svg>
  );
};

export default RotaryFeeder;
