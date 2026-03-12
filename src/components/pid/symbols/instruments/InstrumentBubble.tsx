import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'normal' | 'alarm' | 'fault' | 'offline' | 'manual';
  value?: string | number;
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

export type MountType = 'field' | 'panel' | 'dcs' | 'shared';

export interface InstrumentBubbleProps extends SymbolProps {
  tagLetters: string;
  tagNumber?: string;
  mountType?: MountType;
}

export const STATE_COLORS: Record<string, string> = {
  normal: '#4ade80',
  alarm: '#ef4444',
  fault: '#f97316',
  offline: '#6b7280',
  manual: '#38bdf8',
};

/**
 * ISA 5.1 Instrument Bubble — generic instrument balloon.
 *
 * Mount types per ISA 5.1:
 * - field:  Plain circle (thin outline)
 * - panel:  Circle with solid horizontal line through center
 * - dcs:    Circle with dashed horizontal line through center
 * - shared: Hexagon (ISA "shared display / common" symbol)
 *
 * The bubble is centered in a 48×48 viewBox with an effective
 * instrument circle diameter of ~24 px (r=12).
 */
const InstrumentBubble: React.FC<InstrumentBubbleProps> = ({
  size = 48,
  state = 'normal',
  value,
  color,
  label,
  tagLetters,
  tagNumber,
  mountType = 'field',
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color ?? STATE_COLORS[state] ?? STATE_COLORS.normal;
  const isAlarm = state === 'alarm';
  const isFault = state === 'fault';

  /* Height adjusts for label + optional value readout below */
  const hasLabel = !!label || !!tagNumber;
  const hasValue = value !== undefined && value !== null && value !== '';
  const extraRows = (hasLabel ? 1 : 0) + (hasValue ? 1 : 0);
  const vbHeight = 48 + extraRows * 12;

  /* Bubble center */
  const cx = 24;
  const cy = 24;
  const r = 12; // 24 px diameter

  /* Hexagon points for "shared" mount (inscribed in r) */
  const hexPoints = Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(' ');

  /* Tag text font size — scale down for longer strings */
  const tagFontSize = tagLetters.length <= 2 ? 10 : tagLetters.length === 3 ? 8.5 : 7;

  return (
    <svg
      width={size}
      height={size * (vbHeight / 48)}
      viewBox={`0 0 48 ${vbHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-instrument pid-bubble ${isAlarm ? 'pid-alarm-pulse' : ''} ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-alarm-pulse circle, .pid-alarm-pulse polygon {
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
        {/* Bubble shape based on mount type */}
        {mountType === 'shared' ? (
          <polygon
            points={hexPoints}
            fill="none"
            stroke={stroke}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        ) : (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="1.8"
          />
        )}

        {/* Panel mount — solid horizontal line through center */}
        {mountType === 'panel' && (
          <line
            x1={cx - r}
            y1={cy}
            x2={cx + r}
            y2={cy}
            stroke={stroke}
            strokeWidth="1.2"
          />
        )}

        {/* DCS mount — dashed horizontal line through center */}
        {mountType === 'dcs' && (
          <line
            x1={cx - r}
            y1={cy}
            x2={cx + r}
            y2={cy}
            stroke={stroke}
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
        )}

        {/* Tag letters — positioned above center line for panel/dcs, centered for field/shared */}
        <text
          x={cx}
          y={mountType === 'panel' || mountType === 'dcs' ? cy - 2.5 : cy + 1}
          textAnchor="middle"
          dominantBaseline={mountType === 'panel' || mountType === 'dcs' ? 'auto' : 'central'}
          fontSize={tagFontSize}
          fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
          fontWeight="700"
          fill={stroke}
          letterSpacing="0.3"
        >
          {tagLetters}
        </text>

        {/* For panel/dcs: tag number below the line */}
        {(mountType === 'panel' || mountType === 'dcs') && tagNumber && (
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fontSize="7"
            fontFamily="'Inter', 'Segoe UI', Arial, sans-serif"
            fontWeight="600"
            fill={stroke}
          >
            {tagNumber}
          </text>
        )}
      </g>

      {/* Value readout below the bubble */}
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

      {/* Label / tag number below the value (or directly below bubble) */}
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
          {label || (tagLetters + '-' + tagNumber)}
        </text>
      )}
    </svg>
  );
};

export default InstrumentBubble;
