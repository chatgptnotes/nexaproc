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
 * Homogenizer — High-pressure valve with small gap (homogenizing valve).
 * Fluid is forced through a narrow gap at high pressure.
 */
const Homogenizer: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-homogenizer ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* High-pressure pump cylinder */}
        <rect x="2" y="16" width="14" height="16" fill={fill} opacity="0.1"
          stroke={fill} strokeWidth="2" rx="2" />
        {/* Piston inside */}
        <rect x="4" y="20" width="4" height="8" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" />

        {/* High-pressure pipe */}
        <line x1="16" y1="22" x2="24" y2="22" stroke={fill} strokeWidth="2" />
        <line x1="16" y1="26" x2="24" y2="26" stroke={fill} strokeWidth="2" />
        {/* Pressure indicator */}
        <text x="20" y="20" fontSize="4" fill={fill} opacity="0.4" fontFamily="'Inter', sans-serif">HP</text>

        {/* Homogenizing valve — converging gap */}
        <path
          d="M 24,14 L 24,34"
          stroke={fill}
          strokeWidth="2"
        />
        {/* Valve seat — top */}
        <path d="M 24,18 L 30,20" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />
        {/* Valve seat — bottom */}
        <path d="M 24,30 L 30,28" stroke={fill} strokeWidth="2.5" strokeLinecap="round" />

        {/* Narrow gap between valve seats */}
        <line x1="28" y1="22" x2="28" y2="26" stroke={fill} strokeWidth="0.5" opacity="0.5" />

        {/* Gap flow turbulence indicator */}
        {animated && (
          <g opacity="0.4">
            <path d="M 30,22 Q 32,24 30,26" fill="none" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.3s" repeatCount="indefinite" />
            </path>
            <path d="M 32,21 Q 35,24 32,27" fill="none" stroke={fill} strokeWidth="0.8">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="0.4s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* Outlet pipe */}
        <line x1="30" y1="22" x2="48" y2="22" stroke={fill} strokeWidth="2" />
        <line x1="30" y1="26" x2="48" y2="26" stroke={fill} strokeWidth="2" />

        {/* Valve adjustment spring/screw (top) */}
        <line x1="28" y1="14" x2="28" y2="8" stroke={fill} strokeWidth="1.5" />
        <path d="M 26,8 L 28,4 L 30,8" fill="none" stroke={fill} strokeWidth="1" />
        <line x1="25" y1="4" x2="31" y2="4" stroke={fill} strokeWidth="1.5" />

        {/* Flow arrow */}
        <polygon points="36,20 42,24 36,28" fill={fill} opacity="0.3" />

        {/* Base/frame */}
        <line x1="2" y1="36" x2="30" y2="36" stroke={fill} strokeWidth="1" opacity="0.3" />
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

export default Homogenizer;
