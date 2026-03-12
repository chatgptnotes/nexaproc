import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Orifice Flowmeter (FE — Flow Element) — ISA 5.1
 * Standard orifice plate primary element: a pipe with a restriction
 * plate shown as two converging lines narrowing the flow path.
 * Differential pressure taps are indicated above and below the plate,
 * connecting to a differential pressure transmitter.
 */
const OrificeFlowmeter: React.FC<SymbolProps> = ({
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
      className={`pid-instrument pid-orifice ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        {/* Upper pipe wall */}
        <line x1="2" y1="16" x2="46" y2="16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        {/* Lower pipe wall */}
        <line x1="2" y1="32" x2="46" y2="32" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Orifice plate — vertical line at center, narrowed */}
        <line x1={cx} y1="13" x2={cx} y2="35" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Upstream convergence (vena contracta representation) */}
        <line x1={cx - 8} y1="16" x2={cx} y2="21" stroke={stroke} strokeWidth="1.2" />
        <line x1={cx - 8} y1="32" x2={cx} y2="27" stroke={stroke} strokeWidth="1.2" />

        {/* Downstream expansion */}
        <line x1={cx} y1="21" x2={cx + 8} y2="16" stroke={stroke} strokeWidth="1.2" />
        <line x1={cx} y1="27" x2={cx + 8} y2="32" stroke={stroke} strokeWidth="1.2" />

        {/* High-pressure tap (upstream) */}
        <line x1={cx - 5} y1="16" x2={cx - 5} y2="10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={cx - 5} cy="9" r="1.5" fill={stroke} />

        {/* Low-pressure tap (downstream) */}
        <line x1={cx + 5} y1="16" x2={cx + 5} y2="10" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={cx + 5} cy="9" r="1.5" fill={stroke} />

        {/* "FE" label */}
        <text
          x={cx}
          y="8"
          textAnchor="middle"
          fontSize="5.5"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="600"
          fill={stroke}
        >
          FE
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

export default OrificeFlowmeter;
