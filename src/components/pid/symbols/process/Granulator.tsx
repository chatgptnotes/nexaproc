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
 * Granulator — Rotating drum with granulation indicator.
 * Inclined rotating drum with spray nozzle for binder.
 */
const Granulator: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-granulator ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Inclined drum body — slight tilt */}
        <g transform="rotate(-8 24 24)">
          <rect x="6" y="14" width="36" height="18" rx="4" fill={fill} opacity="0.1"
            stroke={fill} strokeWidth="2" />
          {/* End caps */}
          <ellipse cx="6" cy="23" rx="2" ry="9" fill="none" stroke={fill} strokeWidth="1.5" />
          <ellipse cx="42" cy="23" rx="2" ry="9" fill="none" stroke={fill} strokeWidth="1.5" />

          {/* Internal granules */}
          <g>
            {animated && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 24 23"
                to="360 24 23"
                dur="3s"
                repeatCount="indefinite"
              />
            )}
            <circle cx="14" cy="26" r="1.5" fill={fill} opacity="0.4" />
            <circle cx="18" cy="28" r="1.2" fill={fill} opacity="0.4" />
            <circle cx="22" cy="27" r="1.8" fill={fill} opacity="0.4" />
            <circle cx="28" cy="26" r="1.3" fill={fill} opacity="0.4" />
            <circle cx="32" cy="28" r="1.6" fill={fill} opacity="0.4" />
            <circle cx="36" cy="27" r="1.1" fill={fill} opacity="0.4" />
          </g>
        </g>

        {/* Binder spray nozzle — top center */}
        <line x1="24" y1="2" x2="24" y2="10" stroke={fill} strokeWidth="1.5" />
        <polygon points="22,10 24,13 26,10" fill={fill} opacity="0.5" />

        {/* Feed inlet */}
        <line x1="0" y1="22" x2="6" y2="22" stroke={fill} strokeWidth="1.5" />
        <polygon points="0,20 4,22 0,24" fill={fill} opacity="0.4" />

        {/* Discharge */}
        <line x1="42" y1="24" x2="48" y2="24" stroke={fill} strokeWidth="1.5" />

        {/* Support rollers */}
        <circle cx="14" cy="36" r="2" fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />
        <circle cx="34" cy="38" r="2" fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />

        {/* Base */}
        <line x1="8" y1="42" x2="40" y2="42" stroke={fill} strokeWidth="1" opacity="0.4" />
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

export default Granulator;
