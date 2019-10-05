import * as PropTypes from 'prop-types';
import * as React from 'react';

export const defaultValue = {
  color: '#000000',
  primaryColor: '#ff3860',
  backgroundColor: '#ffffff',
  fontSizeSmall: 8,
  fontSizeNormal: 12,
  strokeWidth: 1,
  arrowSize: 3,
  fps: 60,
};

export const Context = React.createContext(defaultValue);

export const Provider = ({ children }) => <Context.Provider value={defaultValue}>{children}</Context.Provider>;
Provider.propTypes = {
  children: PropTypes.node,
};
