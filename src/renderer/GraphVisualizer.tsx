import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Graph } from '../main/Options';
import styles from './GraphVisualizer.scss';
import { VisualizerProps } from './VisualizerProps';

const COLOR = 'black';
const COLOR_HOVERED = 'red';
const BACKGROUND_COLOR = 'white';

const NODE_FONT_SIZE = 12;
const EDGE_FONT_SIZE = 8;

const STROKE_WIDTH = 1;
const ARROW_SIZE = 5;

const ZOOM_MIN = 0;
const ZOOM_MAX = 20;
const VIEW_HEIGHT_COEFFICIENT = 200;
const VIEW_HEIGHT_BASE = 1 + 1 / 8;
const NODE_RADIUS = 10;
const EDGE_LENGTH = 80;
const EDGE_SPRING = 0.1;
const ATTRACTION_RATIO = 0.01;
const PHYSICS_DURATION = 2000;
const PHYSICS_ITERATION = 2;
const PHYSICS_FPS = 60;

interface Props {
  graph: Graph;
}

export const GraphVisualizer: React.FC<Props & VisualizerProps> = ({ graph, width, height }) => {
  const [viewX, setViewX] = React.useState(0);
  const [viewY, setViewY] = React.useState(0);
  const [zoom, setZoom] = React.useState(0);
  const viewHeight = React.useMemo(() => VIEW_HEIGHT_COEFFICIENT * Math.pow(VIEW_HEIGHT_BASE, zoom), [
    width,
    height,
    zoom,
  ]);
  const viewWidth = React.useMemo(() => viewHeight * (width / height), [width, height, viewHeight]);

  const [pointerX, setPointerX] = React.useState(0);
  const [pointerY, setPointerY] = React.useState(0);
  const [isDown, setIsDown] = React.useState(false);
  const [downTarget, setDownTarget] = React.useState(-1);

  const adjacencyMatrix = React.useMemo(() => {
    const m = [...Array(graph.nodes.length)].map(() => Array(graph.nodes.length).fill(false));
    graph.edges.forEach(([from, to]) => {
      m[from][to] = true;
      if (!graph.directed) m[to][from] = true;
    });
    return m;
  }, [graph]);

  const [nodeStates, setNodeStates] = React.useState<{ x: number; y: number }[]>(
    [...Array(graph.nodes.length)].map(() => ({
      x: Math.random() * VIEW_HEIGHT_COEFFICIENT,
      y: Math.random() * VIEW_HEIGHT_COEFFICIENT,
    }))
  );
  const [modifiedAt, setModifiedAt] = React.useState(new Date());
  React.useEffect(() => {
    if (new Date().getTime() > modifiedAt.getTime() + PHYSICS_DURATION) return;

    const intervalId = setInterval(() => {
      for (let iteration = 0; iteration < PHYSICS_ITERATION; iteration++) {
        for (let i = 0; i < graph.nodes.length; i++) {
          if (isDown && i === downTarget) continue;
          nodeStates[i].x *= 1 - ATTRACTION_RATIO;
          nodeStates[i].y *= 1 - ATTRACTION_RATIO;
        }
        for (let i = 0; i < graph.nodes.length; i++) {
          for (let j = 0; j < graph.nodes.length; j++) {
            if (i === j) continue;
            const lx = nodeStates[j].x - nodeStates[i].x;
            const ly = nodeStates[j].y - nodeStates[i].y;
            const l = Math.sqrt(lx * lx + ly * ly);
            if (l <= EDGE_LENGTH || adjacencyMatrix[i][j]) {
              const dx = (lx - (lx / l) * EDGE_LENGTH) * EDGE_SPRING;
              const dy = (ly - (ly / l) * EDGE_LENGTH) * EDGE_SPRING;
              if (isDown && i === downTarget) {
                nodeStates[j].x -= dx;
                nodeStates[j].y -= dy;
              } else if (isDown && j === downTarget) {
                nodeStates[i].x += dx;
                nodeStates[i].y += dy;
              } else {
                nodeStates[i].x += dx / 2;
                nodeStates[i].y += dy / 2;
                nodeStates[j].x -= dx / 2;
                nodeStates[j].y -= dy / 2;
              }
            }
          }
        }
      }
      setNodeStates(nodeStates);
    }, 1000 / PHYSICS_FPS);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, PHYSICS_DURATION);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isDown, downTarget, nodeStates, modifiedAt, adjacencyMatrix]);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      let x = viewX - viewWidth / 2 + event.clientX * (viewHeight / height);
      let y = viewY - viewHeight / 2 + event.clientY * (viewHeight / height);

      if (isDown) {
        if (downTarget < 0) {
          setViewX(viewX - (x - pointerX));
          setViewY(viewY - (y - pointerY));
          x = pointerX;
          y = pointerY;
        } else {
          nodeStates[downTarget] = {
            x: nodeStates[downTarget].x + (x - pointerX),
            y: nodeStates[downTarget].y + (y - pointerY),
          };
          setNodeStates(nodeStates);
          setModifiedAt(new Date());
        }
      } else {
        const i = nodeStates.findIndex(e => {
          const dx = x - e.x;
          const dy = y - e.y;
          return dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS;
        });
        setDownTarget(i);
      }

      setPointerX(x);
      setPointerY(y);
    },
    [
      height,
      setViewX,
      setViewY,
      viewWidth,
      viewHeight,
      pointerX,
      setPointerX,
      pointerY,
      setPointerY,
      isDown,
      downTarget,
      setDownTarget,
      nodeStates,
      setNodeStates,
      setModifiedAt,
    ]
  );

  const onPointerDown = React.useCallback(() => {
    setIsDown(true);
  }, [setIsDown]);

  const onPointerUp = React.useCallback(() => {
    setIsDown(false);
  }, []);

  const onWheel = React.useCallback(
    (event: React.WheelEvent<SVGSVGElement>) => {
      setZoom(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom + event.deltaY)));
    },
    [zoom, setZoom]
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
      <g stroke={COLOR} strokeWidth={STROKE_WIDTH}>
        {graph.edges.map(([from, to], index) => (
          <line
            key={index}
            x1={nodeStates[from].x}
            y1={nodeStates[from].y}
            x2={nodeStates[to].x}
            y2={nodeStates[to].y}
            stroke={isEdgesHovered[index] ? COLOR_HOVERED : undefined}
          />
        ))}
      </g>
      {graph.directed && (
        <g stroke={COLOR} strokeWidth={STROKE_WIDTH} fill={COLOR}>
          {graph.edges.map(([from, to], index) => {
            const dx = nodeStates[to].x - nodeStates[from].x;
            const dy = nodeStates[to].y - nodeStates[from].y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / length;
            const uy = dy / length;
            const ox = nodeStates[to].x - (NODE_RADIUS + STROKE_WIDTH / 2) * ux;
            const oy = nodeStates[to].y - (NODE_RADIUS + STROKE_WIDTH / 2) * uy;
            return (
              <polygon
                key={index}
                points={`${ox},${oy} ${ox - ARROW_SIZE * ux - (ARROW_SIZE / 2) * uy},${oy -
                  ARROW_SIZE * uy +
                  (ARROW_SIZE / 2) * ux} ${ox - ARROW_SIZE * ux + (ARROW_SIZE / 2) * uy},${oy -
                  ARROW_SIZE * uy -
                  (ARROW_SIZE / 2) * ux}`}
                stroke={isEdgesHovered[index] ? COLOR_HOVERED : undefined}
                fill={isEdgesHovered[index] ? COLOR_HOVERED : undefined}
              />
            );
          })}
        </g>
      )}
      <g fill={COLOR}>
        {graph.edges.map(([from, to, label], index) => (
          <text
            key={index}
            x={(nodeStates[from].x + nodeStates[to].x) / 2}
            y={(nodeStates[from].y + nodeStates[to].y) / 2}
            fontSize={EDGE_FONT_SIZE}
            textAnchor="middle"
            dominantBaseline="central"
            pointerEvents="none"
            fill={isEdgesHovered[index] ? COLOR_HOVERED : undefined}
          >
            {label}
          </text>
        ))}
      </g>
      <g stroke={COLOR} strokeWidth={STROKE_WIDTH} fill={BACKGROUND_COLOR}>
        {graph.nodes.map((label, index) => (
          <circle
            key={index}
            cx={nodeStates[index].x}
            cy={nodeStates[index].y}
            r={NODE_RADIUS}
            stroke={index === downTarget ? COLOR_HOVERED : undefined}
          />
        ))}
      </g>
      <g fill={COLOR}>
        {graph.nodes.map((label, index) => (
          <text
            key={index}
            x={nodeStates[index].x}
            y={nodeStates[index].y}
            fill={downTarget === index ? COLOR_HOVERED : undefined}
            fontSize={NODE_FONT_SIZE}
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
