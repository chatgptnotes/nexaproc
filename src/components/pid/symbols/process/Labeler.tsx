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
 * Labeler — Container on conveyor with label applicator arm.
 * Shows a roll-fed labeling mechanism applying label to container.
 */
const Labeler: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-labeler ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidLabelApply {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-4px); }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Container/bottle on conveyor */}
        <rect x="16" y="18" width="10" height="18" fill="none" stroke={fill} strokeWidth="1.5" rx="1" />
        {/* Bottle neck */}
        <rect x="18" y="14" width="6" height="4" fill="none" stroke={fill} strokeWidth="1" />

        {/* Label on container */}
        <rect x="17" y="22" width="8" height="8" fill={fill} opacity="0.2" stroke={fill} strokeWidth="0.8" />

        {/* Label applicator arm */}
        <g style={animated ? { animation: 'pidLabelApply 1s ease-in-out infinite' } : undefined}>
          {/* Arm body */}
          <line x1="32" y1="26" x2="40" y2="26" stroke={fill} strokeWidth="2.5" />
          {/* Roller/pad at tip */}
          <circle cx="32" cy="26" r="2" fill={fill} opacity="0.4" stroke={fill} strokeWidth="1" />
          {/* Arm mount */}
          <line x1="40" y1="20" x2="40" y2="32" stroke={fill} strokeWidth="2" />
        </g>

        {/* Label roll */}
        <circle cx="42" cy="10" r="5" fill="none" stroke={fill} strokeWidth="1.5" />
        <circle cx="42" cy="10" r="2" fill={fill} opacity="0.3" />
        {/* Label feed path */}
        <path d="M 42,15 L 42,20 L 40,20" fill="none" stroke={fill} strokeWidth="1" opacity="0.5" />

        {/* Conveyor belt */}
        <line x1="2" y1="38" x2="46" y2="38" stroke={fill} strokeWidth="2" />
        <circle cx="4" cy="38" r="2" fill="none" stroke={fill} strokeWidth="1" />
        <circle cx="44" cy="38" r="2" fill="none" stroke={fill} strokeWidth="1" />

        {/* Direction arrow */}
        <polygon points="8,36 14,38 8,40" fill={fill} opacity="0.4" />

        {/* Sensor eye */}
        <circle cx="12" cy="28" r="1.5" fill={fill} opacity="0.5" />
        <line x1="12" y1="28" x2="16" y2="28" stroke={fill} strokeWidth="0.8" strokeDasharray="1 1" opacity="0.4" />
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

export default Labeler;
