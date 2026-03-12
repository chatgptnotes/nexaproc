import React from 'react';
import { SymbolProps, STATE_COLORS } from './InstrumentBubble';

/**
 * Sight Glass (Level Gauge Glass) — ISA 5.1
 * Two parallel vertical lines representing the gauge body with a
 * clear window between them. Process connections at top and bottom.
 * Used for visual level indication on vessels and columns.
 */
const SightGlass: React.FC<SymbolProps> = ({
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

  /* Gauge glass dimensions */
  const glassLeft = cx - 5;
  const glassRight = cx + 5;
  const glassTop = 8;
  const glassBottom = 40;

  /* Simulated liquid level (based on value if numeric, else 50%) */
  let levelFraction = 0.5;
  if (typeof value === 'number') {
    levelFraction = Math.max(0, Math.min(1, value / 100));
  } else if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      levelFraction = Math.max(0, Math.min(1, parsed / 100));
    }
  }
  const liquidTop = glassBottom - (glassBottom - glassTop) * levelFraction;

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-sight-glass ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse line, .pid-alarm-pulse rect {
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

      <g transform={`rotate(${rotation} ${cx} 24)`}>
        {/* Left glass wall */}
        <line
          x1={glassLeft}
          y1={glassTop}
          x2={glassLeft}
          y2={glassBottom}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Right glass wall */}
        <line
          x1={glassRight}
          y1={glassTop}
          x2={glassRight}
          y2={glassBottom}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Top process connection — horizontal flanges */}
        <line x1={glassLeft - 4} y1={glassTop} x2={glassRight + 4} y2={glassTop} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Bottom process connection — horizontal flanges */}
        <line x1={glassLeft - 4} y1={glassBottom} x2={glassRight + 4} y2={glassBottom} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Top nozzle connection to vessel */}
        <line x1={glassRight + 4} y1={glassTop} x2={glassRight + 10} y2={glassTop} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Bottom nozzle connection to vessel */}
        <line x1={glassRight + 4} y1={glassBottom} x2={glassRight + 10} y2={glassBottom} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Liquid level fill — shaded area from liquidTop to bottom */}
        <rect
          x={glassLeft + 1}
          y={liquidTop}
          width={glassRight - glassLeft - 2}
          height={glassBottom - liquidTop}
          fill={stroke}
          opacity="0.25"
        />

        {/* Liquid surface line */}
        <line
          x1={glassLeft + 1}
          y1={liquidTop}
          x2={glassRight - 1}
          y2={liquidTop}
          stroke={stroke}
          strokeWidth="1.2"
        />

        {/* Scale graduation marks on left side */}
        {[0.25, 0.5, 0.75].map((frac) => {
          const y = glassBottom - (glassBottom - glassTop) * frac;
          return (
            <line
              key={frac}
              x1={glassLeft - 2}
              y1={y}
              x2={glassLeft}
              y2={y}
              stroke={stroke}
              strokeWidth="1"
            />
          );
        })}

        {/* "LG" label to the left */}
        <text
          x={glassLeft - 6}
          y={cx}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="5"
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="600"
          fill={stroke}
          transform={`rotate(-90 ${glassLeft - 6} ${cx})`}
        >
          LG
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

export default SightGlass;
