import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ARROW_SIZE, COLOR, COLOR_HOVERED, EDGE_FONT_SIZE, NODE_RADIUS, STROKE_WIDTH } from './constants';

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  hovered?: boolean;
}

export const Edge: React.FC<Props> = ({ x1, y1, x2, y2, label, hovered }) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / length;
  const uy = dy / length;
  const ox = x2 - (NODE_RADIUS + STROKE_WIDTH / 2) * ux;
  const oy = y2 - (NODE_RADIUS + STROKE_WIDTH / 2) * uy;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hovered ? COLOR_HOVERED : COLOR} strokeWidth={STROKE_WIDTH} />
      <polygon
        points={`${ox},${oy} ${ox - ARROW_SIZE * ux - (ARROW_SIZE / 2) * uy},${oy -
          ARROW_SIZE * uy +
          (ARROW_SIZE / 2) * ux} ${ox - ARROW_SIZE * ux + (ARROW_SIZE / 2) * uy},${oy -
          ARROW_SIZE * uy -
          (ARROW_SIZE / 2) * ux}`}
        stroke={hovered ? COLOR_HOVERED : COLOR}
        fill={hovered ? COLOR_HOVERED : COLOR}
      />
      <text
        x={x1 + (x2 - x1) / 2}
        y={y1 + (y2 - y1) / 2}
        fontSize={EDGE_FONT_SIZE}
        textAnchor="middle"
        dominantBaseline="central"
        pointerEvents="none"
        fill={hovered ? COLOR_HOVERED : COLOR}
      >
        {label}
      </text>
    </g>
  );
};

Edge.propTypes = {
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  label: PropTypes.string,
  hovered: PropTypes.bool,
};
