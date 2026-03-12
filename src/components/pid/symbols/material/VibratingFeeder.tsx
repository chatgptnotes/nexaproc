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
 * Vibrating Feeder — Tray/trough on spring supports with motion lines.
 * Vibration motor indicated, material flow direction shown.
 */
const VibratingFeeder: React.FC<SymbolProps> = ({
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

  return (
    <svg
      width={size}
      height={label ? size + 16 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-material pid-vibrating-feeder ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidVibrate {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(0, 0); }
          75% { transform: translate(-1px, 1px); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        <g style={animated ? { animation: 'pidVibrate 0.15s linear infinite' } : undefined}>
          {/* Tray/trough — trapezoidal */}
          <path
            d="M 4,18 L 44,18 L 42,28 L 6,28 Z"
            fill={fill}
            opacity="0.15"
            stroke={fill}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Tray sides */}
          <line x1="4" y1="14" x2="4" y2="18" stroke={fill} strokeWidth="2" />
          <line x1="44" y1="22" x2="44" y2="18" stroke={fill} strokeWidth="2" />

          {/* Vibration motor — eccentric */}
          <circle cx="24" cy="22" r="4" fill="none" stroke={fill} strokeWidth="1.5" />
          <circle cx="25" cy="21" r="1" fill={fill} />
        </g>

        {/* Spring supports */}
        <path d="M 10,28 L 12,32 L 8,34 L 12,36 L 8,38 L 10,40" fill="none" stroke={fill} strokeWidth="1.2" />
        <path d="M 36,28 L 38,32 L 34,34 L 38,36 L 34,38 L 36,40" fill="none" stroke={fill} strokeWidth="1.2" />

        {/* Base line */}
        <line x1="6" y1="42" x2="42" y2="42" stroke={fill} strokeWidth="2" />

        {/* Motion lines */}
        {animated && (
          <g opacity="0.4">
            <line x1="1" y1="16" x2="3" y2="14" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0;0.6;0" dur="0.3s" repeatCount="indefinite" />
            </line>
            <line x1="1" y1="20" x2="3" y2="18" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="0.3s" repeatCount="indefinite" />
            </line>
            <line x1="45" y1="16" x2="47" y2="14" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0.6;0;0.6" dur="0.3s" repeatCount="indefinite" />
            </line>
            <line x1="45" y1="20" x2="47" y2="18" stroke={fill} strokeWidth="1">
              <animate attributeName="opacity" values="0;0.6;0" dur="0.3s" repeatCount="indefinite" />
            </line>
          </g>
        )}

        {/* Flow direction arrow */}
        <polygon points="40,14 44,18 40,22" fill={fill} opacity="0.4" />
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

export default VibratingFeeder;
