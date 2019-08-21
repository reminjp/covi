import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as vis from 'vis-network';
import { Graph } from '../main/Options';
import styles from './GraphVisualizer.scss';

const defaultVisNode: vis.Node = {
  id: 0,
  borderWidth: 2,
  borderWidthSelected: 0,
  color: { border: 'black', background: 'white', highlight: { border: 'red', background: 'white' } },
  font: { color: 'black', face: 'sans-serif', size: 16 },
  labelHighlightBold: false,
  shape: 'dot',
  size: 16,
};

const defaultVisEdge: vis.Edge = {
  from: 0,
  to: 0,
  color: { color: 'black', highlight: 'red' },
  font: { color: 'black', face: 'sans-serif', size: 12 },
  labelHighlightBold: false,
  length: 160,
  selectionWidth: 0,
  smooth: false,
  width: 2,
};

interface Props {
  graph: Graph;
}

export const GraphVisualizer: React.FC<Props> = ({ graph }) => {
  const onContainerLoaded = React.useCallback(
    container => {
      new vis.Network(
        container,
        {
          nodes: graph.nodes.map((e, i) => ({
            ...defaultVisNode,
            ...{
              id: i,
              label: e,
            },
          })),
          edges: graph.edges.map(e => ({
            ...defaultVisEdge,
            ...{
              from: e[0],
              to: e[1],
              label: e[2],
              arrows: graph.directed && { to: { enabled: true, scaleFactor: 0.5 } },
            },
          })),
        },
        {}
      );
    },
    [graph]
  );

  return <div className={styles.root} ref={onContainerLoaded} />;
};

GraphVisualizer.propTypes = {
  graph: PropTypes.any.isRequired,
};
