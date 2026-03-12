import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * RTD (Resistance Temperature Detector) — ISA 5.1 Primary Element
 * Zigzag resistance element symbol representing a platinum resistance
 * thermometer (Pt100 / Pt1000). Drawn as a zigzag wire pattern
 * between two lead connections, enclosed within a rectangular outline.
 */
const RTD: React.FC<SymbolProps> = ({
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

  /* Zigzag resistance element path */
  const zigzag = [
    `M ${cx - 10} ${cy}`,
    `L ${cx - 7} ${cy - 5}`,
    `L ${cx - 3} ${cy + 5}`,
    `L ${cx + 1} ${cy - 5}`,
    `L ${cx + 5} ${cy + 5}`,
    `L ${cx + 8} ${cy - 5}`,
    `L ${cx + 10} ${cy}`,
  ].join(' ');

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-rtd ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse path, .pid-alarm-pulse rect, .pid-alarm-pulse line {
          animation: pidAlarmPulse 1s ease-in-out infinite;
        }
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidAlarmPulse {
          0%, 100% { stroke-width: 2; }
          50% { stroke-width: 3.5; stroke: #ff0000; }
        }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Enclosure rectangle */}
        <rect
          x={cx - 14}
          y={cy - 9}
          width="28"
          height="18"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          rx="1.5"
        />

        {/* Zigzag resistance element */}
        <path
          d={zigzag}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left lead wire */}
        <line
          x1={cx - 14}
          y1={cy}
          x2={cx - 20}
          y2={cy}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Right lead wire */}
        <line
          x1={cx + 14}
          y1={cy}
          x2={cx + 20}
          y2={cy}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* "TE" label above */}
        <text
          x={cx}
          y={cy - 12}
          textAnchor="middle"
          fontSize="6"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="600"
          fill={stroke}
        >
          RTD
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

export default RTD;
