import * as React from 'react';
import { render } from 'react-dom';
import { Options } from '../main/Options';
import './index.scss';
import { App } from './App';

declare const getOptions: (() => Promise<Options>) | undefined;

const defaultGraph: Options = {
  type: 'graph',
  graph: { nodes: ['1', '2', '3'], edges: [[0, 1, '10'], [0, 2, '20'], [1, 2, '30']], directed: true },
};

(async () => {
  const options: Options = typeof getOptions === 'function' ? await getOptions() : defaultGraph;
  render(<App options={options} />, document.getElementById('root'));
})().catch(reason => {
  console.error(reason);
});
