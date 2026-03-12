import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Thermocouple — ISA 5.1 Primary Element Symbol
 * Two dissimilar metal wires meeting at a junction point.
 * Drawn as two angled lines converging to a filled dot (hot junction),
 * with open ends representing the cold junction / connection head.
 * Standard ISA representation for thermocouple sensing elements.
 */
const Thermocouple: React.FC<SymbolProps> = ({
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

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-thermocouple ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse line, .pid-alarm-pulse circle {
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
        {/* Left wire — from upper-left down to junction point */}
        <line
          x1={cx - 12}
          y1={cy - 12}
          x2={cx}
          y2={cy + 6}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Right wire — from upper-right down to junction point */}
        <line
          x1={cx + 12}
          y1={cy - 12}
          x2={cx}
          y2={cy + 6}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Hot junction — filled circle at meeting point */}
        <circle
          cx={cx}
          cy={cy + 6}
          r="2.5"
          fill={stroke}
          stroke={stroke}
          strokeWidth="1"
        />

        {/* Terminal block / connection head at top */}
        <line
          x1={cx - 12}
          y1={cy - 12}
          x2={cx - 12}
          y2={cy - 15}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1={cx + 12}
          y1={cy - 12}
          x2={cx + 12}
          y2={cy - 15}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Small horizontal bar connecting terminals */}
        <line
          x1={cx - 12}
          y1={cy - 15}
          x2={cx + 12}
          y2={cy - 15}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* "TE" label inside connection area */}
        <text
          x={cx}
          y={cy - 9}
          textAnchor="middle"
          fontSize="6"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="600"
          fill={stroke}
        >
          TE
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

export default Thermocouple;
