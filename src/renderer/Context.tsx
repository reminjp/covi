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
  // Graph
  graphZoomMin: 0,
  graphZoomMax: 20,
  graphViewHeightCoefficient: 200,
  graphViewHeightBase: 1 + 1 / 8,
  graphNodeRadius: 10,
  graphEdgeLength: 100,
  graphEdgeSpring: 0.1,
  graphAttractionRatio: 0.01,
  graphPhysicsDuration: 2000,
  graphPhysicsIteration: 2,
};

export const Context = React.createContext(defaultValue);

export const Provider = ({ children }) => <Context.Provider value={defaultValue}>{children}</Context.Provider>;
Provider.propTypes = {
  children: PropTypes.node,
};
