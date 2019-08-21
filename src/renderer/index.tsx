import * as React from 'react';
import { render } from 'react-dom';
import { Options } from '../main/Options';
import { App } from './App';
import './index.scss';

declare const getOptions: (() => Promise<Options>) | undefined;

(async () => {
  const options = getOptions !== undefined ? await getOptions() : {};
  console.log(options);
  render(<App options={options} />, document.getElementById('root'));
})().catch(reason => {
  console.error(reason);
});
