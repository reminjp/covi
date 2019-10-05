import * as PropTypes from 'prop-types';
import * as React from 'react';
import styles from './Navbar.scss';

export const Navbar: React.FC = ({ children }) => <div className={styles.root}>{children}</div>;

Navbar.propTypes = {
  children: PropTypes.node,
};
