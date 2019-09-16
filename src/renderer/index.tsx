import * as React from 'react';
import { render } from 'react-dom';
import { Options } from '../main/Options';
import { GraphVisualizer } from './GraphVisualizer';
import './index.scss';

declare const getOptions: (() => Promise<Options>) | undefined;

const defaultGraph: Options = {
  type: 'graph',
  graph: { nodes: [], edges: [], directed: true },
};
const n = 10;
for (let i = 0; i < n; i++) {
  defaultGraph.graph.nodes.push(String(i + 1));
}
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    if (Math.random() < 2 / 10) {
      defaultGraph.graph.edges.push([i, j, String(Math.floor(Math.random() * 1e9))]);
    }
  }
}

(async () => {
  const options: Options = typeof getOptions === 'function' ? await getOptions() : defaultGraph;
  if (options.graph !== undefined) {
    render(<GraphVisualizer graph={options.graph} />, document.getElementById('root'));
  }
})().catch(reason => {
  console.error(reason);
});
