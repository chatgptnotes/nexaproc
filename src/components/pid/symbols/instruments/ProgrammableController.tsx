import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Programmable Logic Controller (PLC) — ISA 5.1
 * Rectangle with "PLC" text. Per ISA 5.1, a rectangle represents
 * a programmable logic controller or DCS function block.
 * Used to denote PLC/DCS processing nodes on P&ID drawings.
 */
const ProgrammableController: React.FC<SymbolProps> = ({
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
  const halfW = 16; // 32px wide
  const halfH = 10; // 20px tall — rectangle aspect ratio

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-plc ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        {/* Rectangle body */}
        <rect
          x={cx - halfW}
          y={cy - halfH}
          width={halfW * 2}
          height={halfH * 2}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          rx="1.5"
          ry="1.5"
        />

        {/* PLC text */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="10"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fill={stroke}
          letterSpacing="0.5"
        >
          PLC
        </text>

        {/* I/O port indicators — small marks on left and right edges */}
        <line x1={cx - halfW} y1={cy - 4} x2={cx - halfW - 3} y2={cy - 4} stroke={stroke} strokeWidth="1.2" />
        <line x1={cx - halfW} y1={cy + 4} x2={cx - halfW - 3} y2={cy + 4} stroke={stroke} strokeWidth="1.2" />
        <line x1={cx + halfW} y1={cy - 4} x2={cx + halfW + 3} y2={cy - 4} stroke={stroke} strokeWidth="1.2" />
        <line x1={cx + halfW} y1={cy + 4} x2={cx + halfW + 3} y2={cy + 4} stroke={stroke} strokeWidth="1.2" />
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

export default ProgrammableController;
