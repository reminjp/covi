import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Options } from '../main/Options';
import styles from './App.scss';

interface Props {
  options: Options;
}

export const App: React.FC<Props> = ({ options }) => {
  return <div className={styles.root}>{JSON.stringify(options)}</div>;
};

App.propTypes = {
  options: PropTypes.object.isRequired,
};
