import * as PropTypes from 'prop-types';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import { Options } from '../main/Options';
import { GraphVisualizer } from './GraphVisualizer';

interface Props {
  options: Options;
}

export const App: React.FC<Props> = ({ options }) => {
  const [width, setWidth] = React.useState(1);
  const [height, setHeight] = React.useState(1);
  const onResize = React.useCallback((width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  }, []);

  let visualizer: React.ReactNode;
  switch (options.type) {
    case 'graph': {
      if (options.graph) {
        visualizer = <GraphVisualizer graph={options.graph} width={width} height={height} />;
      }
      break;
    }
  }

  return (
    <>
      {visualizer}
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
    </>
  );
};

App.propTypes = {
  options: PropTypes.any.isRequired,
};
