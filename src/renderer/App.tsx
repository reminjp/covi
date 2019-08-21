import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as vis from 'vis-network';
import { Options } from '../main/Options';
import styles from './App.scss';

const defaultVisNode: vis.Node = {
  id: 0,
  borderWidth: 2,
  borderWidthSelected: 0.5,
  color: { border: 'black', background: 'white', highlight: { border: 'red', background: 'white' } },
  font: { color: 'black', face: 'sans-serif', size: 16 },
  labelHighlightBold: false,
  // margin: { top: 12, right: 2, bottom: 12, left: 2 },
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
  selectionWidth: 1,
  smooth: false,
  width: 2,
};

function toVisData(options: Options): vis.Data {
  const n = Math.max(0, Number(options.data[0] && options.data[0][0]));
  const ids = new Set<string>();
  for (let i = 1; i < options.data.length; i++) {
    if (options.data[i] === undefined || options.data[i].length < 2) {
      continue;
    }
    for (let j = 0; j < 2; j++) {
      if (!ids.has(options.data[i][j])) {
        ids.add(options.data[i][j]);
      }
    }
  }

  let areIdsNumber = true;
  ids.forEach(id => {
    const i = Number(id);
    areIdsNumber = areIdsNumber && 1 <= i && i <= n && String(i) === id;
  });

  const nodes: vis.Node[] = [];
  const edges: vis.Edge[] = [];

  ids.forEach(id => {
    nodes.push({
      ...defaultVisNode,
      ...{
        id: id,
        label: id,
      },
    });
  });
  for (let i = 1; nodes.length < n; i++) {
    const s = String(i);
    if (ids.has(s)) {
      continue;
    }
    nodes.push({
      ...defaultVisNode,
      ...{
        id: s,
        label: areIdsNumber && s,
      },
    });
  }
  for (let i = 1; i < options.data.length; i++) {
    if (options.data[i] === undefined || options.data[i].length < 2) {
      continue;
    }
    edges.push({
      ...defaultVisEdge,
      ...{
        from: options.data[i][0],
        to: options.data[i][1],
        label: options.data[i][2],
        arrows: options.directed && { to: { enabled: true, scaleFactor: 0.5 } },
      },
    });
  }

  return { nodes, edges };
}

interface Props {
  options: Options;
}

export const App: React.FC<Props> = ({ options }) => {
  const onContainerLoaded = React.useCallback(
    container => {
      if (options.data === undefined) {
        return;
      }
      new vis.Network(container, toVisData(options), {});
    },
    [options]
  );

  return <div className={styles.root} ref={onContainerLoaded} />;
};

App.propTypes = {
  options: PropTypes.object.isRequired,
};
