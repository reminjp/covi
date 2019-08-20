import * as PropTypes from 'prop-types';
import * as React from 'react';
import styles from './App.scss';

interface Props {
  argv: string[];
  stdin: string;
}

export const App: React.FC<Props> = ({ argv, stdin }) => {
  return (
    <div className={styles.root}>
      {argv.join(',')} {stdin}
    </div>
  );
};

App.propTypes = {
  argv: PropTypes.array.isRequired,
  stdin: PropTypes.string.isRequired,
};
