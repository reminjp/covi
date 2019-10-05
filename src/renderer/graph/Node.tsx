import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Context } from '../Context';
import { NODE_RADIUS } from './constants';

interface Props {
  x: number;
  y: number;
  label?: string;
  hovered?: boolean;
}

export const Node: React.FC<Props> = ({ x, y, label, hovered }) => {
  const context = React.useContext(Context);

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={NODE_RADIUS}
        stroke={hovered ? context.primaryColor : context.color}
        strokeWidth={context.strokeWidth}
        fill={context.backgroundColor}
      />
      {label && (
        <text
          x={x}
          y={y}
          stroke={context.backgroundColor}
          strokeWidth={context.strokeWidth}
          fill={hovered ? context.primaryColor : context.color}
          fontSize={context.fontSizeNormal}
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
};

Node.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  label: PropTypes.string,
  hovered: PropTypes.bool,
};
