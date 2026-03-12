import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Magnetic Flowmeter (Mag Meter) — ISA 5.1
 * Pipe section with "M" indicator and electrode dots on the pipe walls.
 * Uses Faraday's law of electromagnetic induction. Electrodes are
 * shown as small dots on opposite sides of the pipe. Magnetic coils
 * are represented by short perpendicular lines above and below.
 */
const MagneticFlowmeter: React.FC<SymbolProps> = ({
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
      className={`pid-instrument pid-magmeter ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse line, .pid-alarm-pulse circle, .pid-alarm-pulse rect {
          animation: pidAlarmPulse 1s ease-in-out infinite;
        }
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidAlarmPulse {
          0%, 100% { stroke-width: 2; }
          50% { stroke-width: 3.2; stroke: #ff0000; }
        }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {/* Pipe walls */}
        <line x1="4" y1="16" x2="44" y2="16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="32" x2="44" y2="32" stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Meter body — slightly wider section */}
        <rect
          x="14"
          y="14"
          width="20"
          height="20"
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          rx="2"
        />

        {/* Magnetic coil — top */}
        <line x1="19" y1="14" x2="19" y2="10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="14" x2="29" y2="10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="10" x2="29" y2="10" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Magnetic coil — bottom */}
        <line x1="19" y1="34" x2="19" y2="38" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="29" y1="34" x2="29" y2="38" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="38" x2="29" y2="38" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Electrodes — dots on pipe walls at center */}
        <circle cx="14" cy={cy} r="2" fill={stroke} />
        <circle cx="34" cy={cy} r="2" fill={stroke} />

        {/* "M" label */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fill={stroke}
        >
          M
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

export default MagneticFlowmeter;
