import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Radar Level Gauge — ISA 5.1
 * Antenna shape pointing downward into a vessel. Shown as a horn
 * antenna (flared cone) with microwave emission lines below it.
 * Includes transmitter housing on top and nozzle connection.
 */
const RadarLevelGauge: React.FC<SymbolProps> = ({
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

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-radar-level ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse rect, .pid-alarm-pulse path, .pid-alarm-pulse line {
          animation: pidAlarmPulse 1s ease-in-out infinite;
        }
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidAlarmPulse {
          0%, 100% { stroke-width: 1.8; }
          50% { stroke-width: 3; stroke: #ff0000; }
        }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} ${cx} 24)`}>
        {/* Transmitter housing — rectangle at top */}
        <rect
          x={cx - 7}
          y="4"
          width="14"
          height="8"
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          rx="1"
        />

        {/* "LE" label in housing */}
        <text
          x={cx}
          y="9.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="5.5"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fill={stroke}
        >
          LE
        </text>

        {/* Antenna stalk */}
        <line x1={cx} y1="12" x2={cx} y2="18" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

        {/* Horn antenna — flared cone pointing down */}
        <path
          d={`M ${cx - 2} 18 L ${cx - 8} 28 L ${cx + 8} 28 L ${cx + 2} 18 Z`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Microwave emission arcs pointing downward */}
        <path
          d={`M ${cx - 5} 31 Q ${cx} 34 ${cx + 5} 31`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d={`M ${cx - 4} 35 Q ${cx} 37 ${cx + 4} 35`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d={`M ${cx - 3} 39 Q ${cx} 40.5 ${cx + 3} 39`}
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* Vessel nozzle / process connection — horizontal lines at antenna base */}
        <line x1={cx - 12} y1="28" x2={cx - 8} y2="28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <line x1={cx + 8} y1="28" x2={cx + 12} y2="28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
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

export default RadarLevelGauge;
