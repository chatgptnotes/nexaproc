import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Coriolis Flowmeter — ISA 5.1
 * Curved U-tube shape representing the Coriolis measuring tubes.
 * Two parallel curved tubes with inlet/outlet connections. The
 * phase shift between vibrating tubes measures mass flow directly.
 */
const CoriolisFlowmeter: React.FC<SymbolProps> = ({
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
      className={`pid-instrument pid-coriolis ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse path, .pid-alarm-pulse line {
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
        {/* Inlet pipe */}
        <line x1="2" y1={cy} x2="10" y2={cy} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Outlet pipe */}
        <line x1="38" y1={cy} x2="46" y2={cy} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Upper U-tube — curved path */}
        <path
          d={`M 10 ${cy} C 10 ${cy - 16}, 38 ${cy - 16}, 38 ${cy}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Lower U-tube — curved path */}
        <path
          d={`M 10 ${cy} C 10 ${cy + 16}, 38 ${cy + 16}, 38 ${cy}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Drive coil at center top */}
        <line x1={cx - 2} y1={cy - 10} x2={cx + 2} y2={cy - 10} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Pickup sensor indicators */}
        <circle cx={cx - 7} cy={cy - 8} r="1.2" fill={stroke} />
        <circle cx={cx + 7} cy={cy - 8} r="1.2" fill={stroke} />

        {/* Enclosure / transmitter housing */}
        <rect
          x={cx - 6}
          y={cy - 4}
          width="12"
          height="8"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          rx="1"
        />

        {/* "FE" label */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="5.5"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
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

export default CoriolisFlowmeter;
