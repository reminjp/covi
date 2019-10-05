import * as PropTypes from 'prop-types';
import * as React from 'react';
import styles from './Button.scss';

interface Props {
  children: React.ReactNode;
  onClick?(): void;
}

export const Button: React.FC<Props> = ({ children, onClick }) => (
  <span className={styles.root} onClick={onClick}>
    {children}
  </span>
);

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
};
