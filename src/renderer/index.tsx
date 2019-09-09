import * as React from 'react';
import { render } from 'react-dom';
import { Options } from '../main/Options';
import { GraphVisualizer } from './GraphVisualizer';
import './index.scss';

declare const getOptions: (() => Promise<Options>) | undefined;

const defaultGraph: Options = {
  type: 'graph',
  graph: { nodes: ['1', '2', '3'], edges: [[0, 1, '10'], [0, 2, '20'], [1, 2, '30']], directed: true },
};

(async () => {
  const options: Options = typeof getOptions === 'function' ? await getOptions() : defaultGraph;
  if (options.graph !== undefined) {
    render(<GraphVisualizer graph={options.graph} />, document.getElementById('root'));
  }
})().catch(reason => {
  console.error(reason);
});
