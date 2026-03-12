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
 * Bucket Elevator — Vertical loop belt with bucket indicators.
 * Two vertical columns with sprockets top/bottom, buckets on ascending side.
 */
const BucketElevator: React.FC<SymbolProps> = ({
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
      className={`pid-material pid-bucket-elevator ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Casing — vertical rectangle */}
        <rect x="14" y="4" width="20" height="40" fill="none" stroke={fill} strokeWidth="2" rx="2" />

        {/* Top sprocket */}
        <circle cx="24" cy="10" r="4" fill="none" stroke={fill} strokeWidth="1.5" />
        <circle cx="24" cy="10" r="1" fill={fill} />

        {/* Bottom sprocket */}
        <circle cx="24" cy="38" r="4" fill="none" stroke={fill} strokeWidth="1.5" />
        <circle cx="24" cy="38" r="1" fill={fill} />

        {/* Belt — ascending side (right) */}
        <line x1="28" y1="10" x2="28" y2="38" stroke={fill} strokeWidth="1" />
        {/* Belt — descending side (left) */}
        <line x1="20" y1="10" x2="20" y2="38" stroke={fill} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

        {/* Buckets on ascending side */}
        {[16, 22, 28, 34].map((y) => (
          <g key={y}>
            {animated && (
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0,0;0,-6`}
                dur="2s"
                repeatCount="indefinite"
              />
            )}
            <path
              d={`M 28,${y} L 32,${y} L 31,${y + 3} L 29,${y + 3} Z`}
              fill={fill}
              opacity="0.4"
              stroke={fill}
              strokeWidth="0.8"
            />
          </g>
        ))}

        {/* Inlet at bottom */}
        <path d="M 8,38 L 14,38 L 14,42" fill="none" stroke={fill} strokeWidth="1.5" />
        <polygon points="6,36 12,36 9,40" fill={fill} opacity="0.5" />

        {/* Discharge at top */}
        <path d="M 34,8 L 40,8 L 40,14" fill="none" stroke={fill} strokeWidth="1.5" />
        <polygon points="38,10 42,10 40,14" fill={fill} opacity="0.5" />

        {/* Direction arrow */}
        <polygon points="30,20 32,24 28,24" fill={fill} opacity="0.5" />
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

export default BucketElevator;
