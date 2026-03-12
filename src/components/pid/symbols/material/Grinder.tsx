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
 * Grinder — Grinding disc/wheel shape with material feed and discharge.
 * Rotating disc with radial grooves inside a housing.
 */
const Grinder: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-grinder ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Housing */}
        <rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke={fill} strokeWidth="2" />

        {/* Grinding disc */}
        <g>
          {animated && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 24"
              to="360 24 24"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          <circle cx="24" cy="24" r="12" fill="none" stroke={fill} strokeWidth="2" />
          {/* Hub */}
          <circle cx="24" cy="24" r="3" fill={fill} opacity="0.4" stroke={fill} strokeWidth="1" />
          {/* Radial grooves */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 24 + 4 * Math.cos(rad);
            const y1 = 24 + 4 * Math.sin(rad);
            const x2 = 24 + 11 * Math.cos(rad);
            const y2 = 24 + 11 * Math.sin(rad);
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={fill} strokeWidth="0.8" opacity="0.5" />
            );
          })}
        </g>

        {/* Feed inlet — top */}
        <path d="M 20,2 L 20,8 M 28,2 L 28,8" stroke={fill} strokeWidth="1.5" />
        <polygon points="22,0 24,4 26,0" fill={fill} opacity="0.5" />

        {/* Discharge — bottom */}
        <path d="M 20,40 L 20,46 M 28,40 L 28,46" stroke={fill} strokeWidth="1.5" />
        <polygon points="22,44 24,48 26,44" fill={fill} opacity="0.5" />
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

export default Grinder;
