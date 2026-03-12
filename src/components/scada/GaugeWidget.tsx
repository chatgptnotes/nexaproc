import React, { useMemo } from 'react';
import clsx from 'clsx';

export interface GaugeThresholds {
  lolo?: number;
  low?: number;
  high?: number;
  hihi?: number;
}

export interface GaugeWidgetProps {
  value: number;
  min: number;
  max: number;
  unit: string;
  label: string;
  thresholds?: GaugeThresholds;
}

/**
 * Converts a polar coordinate to cartesian.
 * Angle in degrees, 0 = 12-o'clock, measured clockwise.
 */
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

/**
 * Build an SVG arc path from startAngle to endAngle (degrees).
 */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function getAlarmColor(
  value: number,
  min: number,
  max: number,
  thresholds?: GaugeThresholds,
): string {
  if (!thresholds) return '#4ade80'; // nexaproc-green

  if (thresholds.hihi !== undefined && value >= thresholds.hihi) return '#ef4444';
  if (thresholds.lolo !== undefined && value <= thresholds.lolo) return '#ef4444';
  if (thresholds.high !== undefined && value >= thresholds.high) return '#fbbf24';
  if (thresholds.low !== undefined && value <= thresholds.low) return '#fbbf24';
  return '#4ade80';
}

const GaugeWidget: React.FC<GaugeWidgetProps> = ({
  value,
  min,
  max,
  unit,
  label,
  thresholds,
}) => {
  const cx = 120;
  const cy = 110;
  const radius = 85;
  const strokeWidth = 14;
  const startAngle = -90; // left side of semicircle (pointing left)
  const endAngle = 90;    // right side of semicircle (pointing right)
  // We draw a semicircle from 180deg to 360deg (bottom half inverted = top half semicircle)
  // Actually let's use 180 sweep: -90 to +90 maps to left-to-right semicircle on top

  const clampedValue = Math.min(Math.max(value, min), max);
  const fraction = (clampedValue - min) / (max - min);
  const sweepAngle = startAngle + fraction * (endAngle - startAngle);

  const alarmColor = useMemo(
    () => getAlarmColor(value, min, max, thresholds),
    [value, min, max, thresholds],
  );

  // Background arc (full semicircle, 180 degrees from left to right across top)
  const bgArc = describeArc(cx, cy, radius, 180, 360);
  // Value arc
  const valueEndAngle = 180 + fraction * 180;
  const valArc =
    fraction > 0.001
      ? describeArc(cx, cy, radius, 180, valueEndAngle)
      : '';

  // Threshold tick marks
  const ticks = useMemo(() => {
    if (!thresholds) return [];
    const items: { angle: number; color: string; label: string }[] = [];
    const toAngle = (v: number) => 180 + ((v - min) / (max - min)) * 180;
    if (thresholds.lolo !== undefined)
      items.push({ angle: toAngle(thresholds.lolo), color: '#ef4444', label: 'LL' });
    if (thresholds.low !== undefined)
      items.push({ angle: toAngle(thresholds.low), color: '#fbbf24', label: 'L' });
    if (thresholds.high !== undefined)
      items.push({ angle: toAngle(thresholds.high), color: '#fbbf24', label: 'H' });
    if (thresholds.hihi !== undefined)
      items.push({ angle: toAngle(thresholds.hihi), color: '#ef4444', label: 'HH' });
    return items;
  }, [thresholds, min, max]);

  // Needle
  const needleAngle = 180 + fraction * 180;
  const needleTip = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 4, needleAngle);

  return (
    <div className="rounded-lg border border-scada-border bg-scada-panel p-4 flex flex-col items-center">
      <svg
        viewBox="0 0 240 140"
        className="w-full max-w-[280px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="#1a3a24"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Threshold colored segments */}
        {thresholds && (() => {
          const toAngle = (v: number) => 180 + Math.min(Math.max((v - min) / (max - min), 0), 1) * 180;
          const segments: React.ReactNode[] = [];

          // Build ranges: lolo zone, low zone, normal zone, high zone, hihi zone
          const points: { angle: number; color: string }[] = [];
          points.push({ angle: 180, color: thresholds.lolo !== undefined ? '#ef4444' : thresholds.low !== undefined ? '#fbbf24' : '#4ade80' });

          if (thresholds.lolo !== undefined) {
            points.push({ angle: toAngle(thresholds.lolo), color: thresholds.low !== undefined ? '#fbbf24' : '#4ade80' });
          }
          if (thresholds.low !== undefined) {
            points.push({ angle: toAngle(thresholds.low), color: '#4ade80' });
          }
          if (thresholds.high !== undefined) {
            points.push({ angle: toAngle(thresholds.high), color: '#fbbf24' });
          }
          if (thresholds.hihi !== undefined) {
            points.push({ angle: toAngle(thresholds.hihi), color: '#ef4444' });
          }
          points.push({ angle: 360, color: '' });

          for (let i = 0; i < points.length - 1; i++) {
            const from = points[i].angle;
            const to = points[i + 1].angle;
            if (to - from < 0.5) continue;
            segments.push(
              <path
                key={i}
                d={describeArc(cx, cy, radius, from, to)}
                fill="none"
                stroke={points[i].color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                opacity={0.2}
              />,
            );
          }
          return segments;
        })()}

        {/* Value arc */}
        {valArc && (
          <path
            d={valArc}
            fill="none"
            stroke={alarmColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        )}

        {/* Threshold tick marks */}
        {ticks.map((tick, i) => {
          const outer = polarToCartesian(cx, cy, radius + strokeWidth / 2 + 2, tick.angle);
          const inner = polarToCartesian(cx, cy, radius - strokeWidth / 2 - 2, tick.angle);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={tick.color}
              strokeWidth={2}
              opacity={0.7}
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={alarmColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        <circle cx={cx} cy={cy} r={5} fill={alarmColor} opacity={0.8} />
        <circle cx={cx} cy={cy} r={2.5} fill="#0d2416" />

        {/* Min / Max labels */}
        <text x={cx - radius - 4} y={cy + 16} fill="#6b7280" fontSize="10" textAnchor="end">
          {min}
        </text>
        <text x={cx + radius + 4} y={cy + 16} fill="#6b7280" fontSize="10" textAnchor="start">
          {max}
        </text>

        {/* Center value */}
        <text
          x={cx}
          y={cy - 12}
          fill={alarmColor}
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="monospace"
          className="transition-all duration-500"
        >
          {value.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + 6}
          fill="#9ca3af"
          fontSize="12"
          textAnchor="middle"
        >
          {unit}
        </text>
      </svg>

      {/* Label */}
      <p className="text-sm text-gray-400 mt-1 text-center truncate w-full">{label}</p>
    </div>
  );
};

export default GaugeWidget;
