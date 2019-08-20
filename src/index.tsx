import * as React from 'react';
import { render } from 'react-dom';
import { App } from './App';
import './index.scss';

(async () => {
  /* global getArgv, getStdin */
  const argv = (await getArgv()) || [];
  const stdin = (await getStdin()) || 'mohuhu';

  render(<App argv={argv} stdin={stdin} />, document.getElementById('root'));
})();
