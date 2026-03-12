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
 * Coater — Rotating drum/pan with coating applicator (spray gun).
 * Perforated drum with air flow and coating spray.
 */
const Coater: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-coater ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Drum body — wider pan shape */}
        <path
          d="M 8,12 Q 4,24 8,36 L 40,36 Q 44,24 40,12 Z"
          fill={fill}
          opacity="0.08"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Perforations (small dots on drum wall) */}
        {[14, 20, 26, 32, 38].map((x) => (
          <g key={x}>
            <circle cx={x} cy="14" r="0.8" fill={fill} opacity="0.3" />
            <circle cx={x} cy="34" r="0.8" fill={fill} opacity="0.3" />
          </g>
        ))}

        {/* Rotating contents */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="3s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="18" cy="28" r="1.5" fill={fill} opacity="0.3" />
          <circle cx="24" cy="30" r="1.2" fill={fill} opacity="0.3" />
          <circle cx="30" cy="28" r="1.8" fill={fill} opacity="0.3" />
          <circle cx="22" cy="26" r="1.0" fill={fill} opacity="0.3" />
          <circle cx="28" cy="26" r="1.3" fill={fill} opacity="0.3" />
        </g>

        {/* Spray gun/applicator from top */}
        <line x1="24" y1="0" x2="24" y2="16" stroke={fill} strokeWidth="1.5" />
        <path d="M 22,16 L 24,20 L 26,16" fill={fill} opacity="0.5" />

        {/* Coating spray pattern */}
        {animated && (
          <g opacity="0.3">
            <line x1="23" y1="20" x2="20" y2="24" stroke={fill} strokeWidth="0.6">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.5s" repeatCount="indefinite" />
            </line>
            <line x1="24" y1="20" x2="24" y2="25" stroke={fill} strokeWidth="0.6">
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="0.4s" repeatCount="indefinite" />
            </line>
            <line x1="25" y1="20" x2="28" y2="24" stroke={fill} strokeWidth="0.6">
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur="0.6s" repeatCount="indefinite" />
            </line>
          </g>
        )}

        {/* Air inlet */}
        <line x1="0" y1="24" x2="8" y2="24" stroke={fill} strokeWidth="1.5" />
        <text x="2" y="22" fontSize="4" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">Air</text>

        {/* Exhaust */}
        <line x1="40" y1="18" x2="48" y2="18" stroke={fill} strokeWidth="1.5" />

        {/* Support */}
        <line x1="12" y1="36" x2="12" y2="42" stroke={fill} strokeWidth="1.5" />
        <line x1="36" y1="36" x2="36" y2="42" stroke={fill} strokeWidth="1.5" />
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

export default Coater;
