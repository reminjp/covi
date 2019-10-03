import * as PropTypes from 'prop-types';
import * as React from 'react';
import { BACKGROUND_COLOR, COLOR, COLOR_HOVERED, NODE_FONT_SIZE, NODE_RADIUS, STROKE_WIDTH } from './constants';

interface Props {
  x: number;
  y: number;
  label?: string;
  hovered?: boolean;
}

export const Node: React.FC<Props> = ({ x, y, label, hovered }) => {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={NODE_RADIUS}
        stroke={hovered ? COLOR_HOVERED : COLOR}
        strokeWidth={STROKE_WIDTH}
        fill={BACKGROUND_COLOR}
      />
      {label && (
        <text
          x={x}
          y={y}
          fill={hovered ? COLOR_HOVERED : COLOR}
          fontSize={NODE_FONT_SIZE}
          textAnchor="middle"
          dominantBaseline="central"
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
};

Node.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  label: PropTypes.string,
  hovered: PropTypes.bool,
};
