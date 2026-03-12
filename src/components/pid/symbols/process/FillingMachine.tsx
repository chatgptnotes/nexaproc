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
 * Filling Machine — Nozzle above container with fill level indicator.
 * Shows fill nozzle dispensing into a container/bottle.
 */
const FillingMachine: React.FC<SymbolProps> = ({
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
      className={`pid-process pid-filling-machine ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pidFillLevel {
          0% { height: 0; y: 40; }
          80% { height: 14; y: 26; }
          100% { height: 14; y: 26; }
        }
      `}</style>
      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Supply line — horizontal pipe at top */}
        <line x1="0" y1="4" x2="48" y2="4" stroke={fill} strokeWidth="2" />

        {/* Fill nozzle */}
        <rect x="22" y="4" width="4" height="10" fill={fill} opacity="0.3" stroke={fill} strokeWidth="1" />
        <path d="M 21,14 L 24,18 L 27,14" fill="none" stroke={fill} strokeWidth="1.5" />

        {/* Fill stream */}
        {animated && (
          <line x1="24" y1="18" x2="24" y2="26" stroke={fill} strokeWidth="1.5" opacity="0.5">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="0.5s" repeatCount="indefinite" />
          </line>
        )}

        {/* Container/bottle */}
        <path
          d="M 16,24 L 16,42 L 32,42 L 32,24 L 28,22 L 20,22 Z"
          fill="none"
          stroke={fill}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Fill level inside container */}
        <rect x="17" y={animated ? '28' : '34'} width="14" height={animated ? '13' : '7'}
          fill={fill} opacity="0.2">
          {animated && (
            <animate attributeName="height" values="0;13;13" dur="2s" repeatCount="indefinite" />
          )}
          {animated && (
            <animate attributeName="y" values="41;28;28" dur="2s" repeatCount="indefinite" />
          )}
        </rect>

        {/* Conveyor belt under container */}
        <line x1="4" y1="44" x2="44" y2="44" stroke={fill} strokeWidth="2" />
        <circle cx="6" cy="44" r="2" fill="none" stroke={fill} strokeWidth="1" />
        <circle cx="42" cy="44" r="2" fill="none" stroke={fill} strokeWidth="1" />

        {/* Next container waiting */}
        <rect x="36" y="36" width="8" height="8" fill="none" stroke={fill} strokeWidth="1" opacity="0.3" rx="1" />
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

export default FillingMachine;
