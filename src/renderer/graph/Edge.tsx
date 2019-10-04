import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
  ARROW_SIZE,
  BACKGROUND_COLOR,
  COLOR,
  COLOR_HOVERED,
  EDGE_FONT_SIZE,
  EDGE_LENGTH,
  NODE_RADIUS,
  STROKE_WIDTH,
} from './constants';

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  directed?: boolean;
  variant?: number;
  label?: string;
  hovered?: boolean;
}

export const Edge: React.FC<Props> = ({ x1, y1, x2, y2, directed, variant, label, hovered }) => {
  // Loop
  if (x1 === x2 && y1 === y2) {
    const r = EDGE_LENGTH / (2 * Math.PI);
    const cvx = r * Math.cos(-(Math.PI / 2) + variant);
    const cvy = r * Math.sin(-(Math.PI / 2) + variant);

    return (
      <g>
        <circle
          cx={x1 + cvx}
          cy={y1 + cvy}
          r={r}
          stroke={hovered ? COLOR_HOVERED : COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {label && (
          <text
            x={x1 + 2 * cvx}
            y={y1 + 2 * cvy}
            stroke={BACKGROUND_COLOR}
            strokeWidth={STROKE_WIDTH}
            fill={hovered ? COLOR_HOVERED : COLOR}
            fontSize={EDGE_FONT_SIZE}
            paintOrder="stroke"
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  const vx = x2 - x1;
  const vy = y2 - y1;
  const l = Math.sqrt(vx * vx + vy * vy);
  const ux = vx / l;
  const uy = vy / l;

  // Single edge
  if (variant === undefined || variant === 0) {
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hovered ? COLOR_HOVERED : COLOR} strokeWidth={STROKE_WIDTH} />
        {directed && (
          <polygon
            points={toArrowPoints(x2 - NODE_RADIUS * ux, y2 - NODE_RADIUS * uy, ux, uy)}
            stroke={hovered ? COLOR_HOVERED : COLOR}
            fill={hovered ? COLOR_HOVERED : COLOR}
          />
        )}
        {label && (
          <text
            x={x1 + vx / 2}
            y={y1 + vy / 2}
            stroke={BACKGROUND_COLOR}
            strokeWidth={STROKE_WIDTH}
            fill={hovered ? COLOR_HOVERED : COLOR}
            fontSize={EDGE_FONT_SIZE}
            paintOrder="stroke"
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  // One of multiple edges
  const cx = x1 + vx / 2 + -uy * (EDGE_LENGTH / 2) * variant;
  const cy = y1 + vy / 2 + ux * (EDGE_LENGTH / 2) * variant;

  const v1x = cx - x1;
  const v1y = cy - y1;
  const l1 = Math.sqrt(v1x * v1x + v1y * v1y);
  const uv1x = v1x / l1;
  const uv1y = v1y / l1;

  const v2x = x2 - cx;
  const v2y = y2 - cy;
  const l2 = Math.sqrt(v2x * v2x + v2y * v2y);
  const uv2x = v2x / l2;
  const uv2y = v2y / l2;

  const end1X = x1 + NODE_RADIUS * uv1x;
  const end1Y = y1 + NODE_RADIUS * uv1y;
  const end2X = x2 - NODE_RADIUS * uv2x;
  const end2Y = y2 - NODE_RADIUS * uv2y;

  return (
    <g>
      <path
        d={`M${end1X},${end1Y} Q${cx},${cy} ${end2X},${end2Y}`}
        fill="none"
        stroke={hovered ? COLOR_HOVERED : COLOR}
        strokeWidth={STROKE_WIDTH}
      />
      {directed && (
        <polygon
          points={toArrowPoints(end2X, end2Y, uv2x, uv2y)}
          stroke={hovered ? COLOR_HOVERED : COLOR}
          fill={hovered ? COLOR_HOVERED : COLOR}
        />
      )}
      {label && (
        <text
          x={((x1 + x2) / 2 + (x1 + v1x)) / 2}
          y={((y1 + y2) / 2 + (y1 + v1y)) / 2}
          stroke={BACKGROUND_COLOR}
          strokeWidth={STROKE_WIDTH}
          fontSize={EDGE_FONT_SIZE}
          paintOrder="stroke"
          textAnchor="middle"
          dominantBaseline="central"
          pointerEvents="none"
          fill={hovered ? COLOR_HOVERED : COLOR}
        >
          {label}
        </text>
      )}
    </g>
  );
};

Edge.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  directed: PropTypes.bool,
  variant: PropTypes.number,
  label: PropTypes.string,
  hovered: PropTypes.bool,
};

function toArrowPoints(x: number, y: number, ux: number, uy: number): string {
  const points: [number, number][] = [
    [x, y],
    [x - ARROW_SIZE * ux - (ARROW_SIZE / 2) * uy, y - ARROW_SIZE * uy + (ARROW_SIZE / 2) * ux],
    [x - ARROW_SIZE * ux + (ARROW_SIZE / 2) * uy, y - ARROW_SIZE * uy - (ARROW_SIZE / 2) * ux],
  ];
  return points.map(e => e.join(',')).join(' ');
}
