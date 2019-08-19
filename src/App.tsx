import * as PropTypes from 'prop-types';
import * as React from 'react';
import styles from './App.scss';

interface Props {
  test?: string;
}

export const App: React.FC<Props> = ({ test }) => {
  return <div className={styles.root}>Hello {test}</div>;
};

App.propTypes = {
  test: PropTypes.string,
};
