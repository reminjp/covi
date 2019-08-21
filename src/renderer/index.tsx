import * as React from 'react';
import { render } from 'react-dom';
import { Options } from '../main/Options';
import { GraphVisualizer } from './GraphVisualizer';
import './index.scss';

declare const getOptions: (() => Promise<Options>) | undefined;

(async () => {
  const options = getOptions !== undefined ? await getOptions() : {};
  if (options.graph !== undefined) {
    render(<GraphVisualizer graph={options.graph} />, document.getElementById('root'));
  }
})().catch(reason => {
  console.error(reason);
});
