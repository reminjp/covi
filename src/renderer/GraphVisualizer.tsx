import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Graph } from '../main/Options';
import styles from './GraphVisualizer.scss';
import { VisualizerProps } from './VisualizerProps';

const color = 'black';
const colorHovered = 'red';
const backgroundColor = 'white';

const strokeWidth = 1;
const arrowSize = 2;

const zoomMin = 0;
const zoomMax = 20;
const viewHeightCoefficient = 200;
const viewHeightBase = 1 + 1 / 8;
const nodeRadius = 10;
const edgeLength = 100;
const edgeSpring = 0.01;

interface Props {
  graph: Graph;
}

export const GraphVisualizer: React.FC<Props & VisualizerProps> = ({ graph, width, height }) => {
  const [viewX, setViewX] = React.useState(0);
  const [viewY, setViewY] = React.useState(0);
  const [zoom, setZoom] = React.useState(0);
  const viewHeight = React.useMemo(() => viewHeightCoefficient * Math.pow(viewHeightBase, zoom), [width, height, zoom]);
  const viewWidth = React.useMemo(() => viewHeight * (width / height), [width, height, viewHeight]);

  const [isDown, setIsDown] = React.useState(false);
  const [downX, setDownX] = React.useState(0);
  const [downY, setDownY] = React.useState(0);
  const [downTarget, setDownTarget] = React.useState(-1);
  const [downTargetX, setDownTargetX] = React.useState(0);
  const [downTargetY, setDownTargetY] = React.useState(0);

  const initialNodeStates = React.useMemo(() => {
    const nodes = [...Array(graph.nodes.length)].map(() => ({
      x: Math.random() * viewHeightCoefficient,
      y: Math.random() * viewHeightCoefficient,
    }));

    const matrix = [...Array(nodes.length)].map(() => Array(nodes.length).fill(false));
    graph.edges.forEach(([from, to]) => {
      matrix[from][to] = true;
      matrix[to][from] = true;
    });

    for (let iteration = 0; iteration < 100; iteration++) {
      for (let i = 0; i < graph.nodes.length; i++) {
        for (let j = 0; j < graph.nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= edgeLength) {
            nodes[i].x -= dx * edgeSpring;
            nodes[i].y -= dy * edgeSpring;
            nodes[j].x += dx * edgeSpring;
            nodes[j].y += dy * edgeSpring;
          } else if (matrix[i][j]) {
            nodes[i].x += dx * edgeSpring;
            nodes[i].y += dy * edgeSpring;
            nodes[j].x -= dx * edgeSpring;
            nodes[j].y -= dy * edgeSpring;
          }
        }
      }
    }

    let xMin = Number.MAX_VALUE;
    let xMax = Number.MIN_VALUE;
    let yMin = Number.MAX_VALUE;
    let yMax = Number.MIN_VALUE;
    nodes.forEach(({ x, y }) => {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });
    setViewX(xMin + (xMax - xMin) / 2);
    setViewY(yMin + (yMax - yMin) / 2);

    return nodes;
  }, [graph]);

  const [nodeStates, setNodeStates] = React.useState<{ x: number; y: number }[]>(initialNodeStates);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const x = viewX - viewWidth / 2 + event.clientX * (viewHeight / height);
      const y = viewY - viewHeight / 2 + event.clientY * (viewHeight / height);

      if (isDown) {
        if (downTarget < 0) {
          setViewX(downTargetX - (x - downX));
          setViewY(downTargetY - (y - downY));
        } else {
          const a = nodeStates.concat();
          a[downTarget] = { x: downTargetX + (x - downX), y: downTargetY + (y - downY) };
          setNodeStates(a);
        }
      } else {
        const i = nodeStates.findIndex(e => {
          const dx = x - e.x;
          const dy = y - e.y;
          return dx * dx + dy * dy <= nodeRadius * nodeRadius;
        });
        setDownTarget(i);
      }
    },
    [height, viewWidth, viewHeight, isDown, downX, downY, downTarget, downTargetX, downTargetY, nodeStates]
  );

  const onPointerDown = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const x = viewX - viewWidth / 2 + event.clientX * (viewHeight / height);
      const y = viewY - viewHeight / 2 + event.clientY * (viewHeight / height);
      setIsDown(true);
      setDownX(x);
      setDownY(y);
      if (downTarget < 0) {
        setDownTargetX(viewX);
        setDownTargetY(viewY);
      } else {
        setDownTargetX(nodeStates[downTarget].x);
        setDownTargetY(nodeStates[downTarget].y);
      }
    },
    [height, viewX, viewY, viewWidth, viewHeight, downTarget, nodeStates]
  );

  const onPointerUp = React.useCallback(() => {
    setIsDown(false);
  }, []);

  const onWheel = React.useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      setZoom(Math.max(zoomMin, Math.min(zoomMax, zoom + event.deltaY)));
    },
    [zoom]
  );

  // const multiedge = new Map<string, number[]>();
  // graph.edges.forEach((e, i) => {
  //   const s = `${e[0]} ${e[1]}`;
  //   multiedge.set(s, (multiedge.get(s) || 0) + 1);
  // });

  const isEdgesHovered = graph.edges.map(([from, to]) => from === downTarget || (!graph.directed && to === downTarget));

  return (
    <svg
      className={styles.root}
      width={width}
      height={height}
      viewBox={`${viewX - viewWidth / 2} ${viewY - viewHeight / 2} ${viewWidth} ${viewHeight}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      <g stroke={color} strokeWidth={strokeWidth}>
        {graph.edges.map(([from, to], index) => (
          <line
            key={index}
            x1={nodeStates[from].x}
            y1={nodeStates[from].y}
            x2={nodeStates[to].x}
            y2={nodeStates[to].y}
            stroke={isEdgesHovered[index] ? colorHovered : undefined}
          />
        ))}
      </g>
      {graph.directed && (
        <g stroke={color} strokeWidth={strokeWidth} fill={color}>
          {graph.edges.map(([from, to], index) => {
            const dx = nodeStates[to].x - nodeStates[from].x;
            const dy = nodeStates[to].y - nodeStates[from].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;
            const ox = nodeStates[to].x - (nodeRadius + strokeWidth / 2) * ux;
            const oy = nodeStates[to].y - (nodeRadius + strokeWidth / 2) * uy;
            return (
              <polygon
                key={index}
                points={`${ox},${oy} ${ox - arrowSize * ux - (arrowSize / 2) * uy},${oy -
                  arrowSize * uy +
                  (arrowSize / 2) * ux} ${ox - arrowSize * ux + (arrowSize / 2) * uy},${oy -
                  arrowSize * uy -
                  (arrowSize / 2) * ux}`}
                stroke={isEdgesHovered[index] ? colorHovered : undefined}
                fill={isEdgesHovered[index] ? colorHovered : undefined}
              />
            );
          })}
        </g>
      )}
      <g fill={color}>
        {graph.edges.map(([from, to, label], index) => (
          <text
            key={index}
            x={(nodeStates[from].x + nodeStates[to].x) / 2}
            y={(nodeStates[from].y + nodeStates[to].y) / 2}
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
            fill={isEdgesHovered[index] ? colorHovered : undefined}
          >
            {label}
          </text>
        ))}
      </g>
      <g stroke={color} strokeWidth={strokeWidth} fill={backgroundColor}>
        {graph.nodes.map((label, index) => (
          <circle
            key={index}
            cx={nodeStates[index].x}
            cy={nodeStates[index].y}
            r={nodeRadius}
            stroke={index === downTarget ? colorHovered : undefined}
          />
        ))}
      </g>
      <g fill={color}>
        {graph.nodes.map((label, index) => (
          <text
            key={index}
            x={nodeStates[index].x}
            y={nodeStates[index].y}
            fill={downTarget === index ? colorHovered : undefined}
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
          >
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
};

GraphVisualizer.propTypes = {
  graph: PropTypes.any.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
