import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Control Station / Hand Controller (HC) — ISA 5.1
 * Square shape with "HC" text — represents an operator control station.
 * Per ISA 5.1, a square/rectangle denotes a discrete instrument or
 * hand-operated controller. H = Hand (manual), C = Controller.
 */
const ControlStation: React.FC<SymbolProps> = ({
  size = 48,
  state = 'normal',
  value,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color ?? STATE_COLORS[state] ?? STATE_COLORS.normal;
  const isAlarm = state === 'alarm';
  const isFault = state === 'fault';

  const hasValue = value !== undefined && value !== null && value !== '';
  const hasLabel = !!label;
  const extraRows = (hasLabel ? 1 : 0) + (hasValue ? 1 : 0);
  const vbHeight = 48 + extraRows * 12;

  const cx = 24;
  const cy = 24;
  const half = 11; // 22×22 square within 48×48 viewBox

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-control-station ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse rect {
          animation: pidAlarmPulse 1s ease-in-out infinite;
        }
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidAlarmPulse {
          0%, 100% { stroke-width: 1.8; }
          50% { stroke-width: 3.2; stroke: #ff0000; }
        }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Square body */}
        <rect
          x={cx - half}
          y={cy - half}
          width={half * 2}
          height={half * 2}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* HC tag letters */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fill={stroke}
          letterSpacing="0.3"
        >
          HC
        </text>
      </g>

      {hasValue && (
        <text
          x={cx}
          y={48 + 9}
          textAnchor="middle"
          fontSize="8"
          fontFamily="'JetBrains Mono', 'Consolas', monospace"
          fontWeight="600"
          fill={stroke}
        >
          {value}
        </text>
      )}

      {hasLabel && (
        <text
          x={cx}
          y={48 + (hasValue ? 21 : 9)}
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="600"
          fill={stroke}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default ControlStation;
