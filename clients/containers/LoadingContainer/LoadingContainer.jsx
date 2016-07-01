'use strict';

import {connect} from 'react-redux';
import FullScreenMessage from 'components/FullScreenMessage';


const mapStateToProps = (state) => {
  var text = '';

  if (state.loading) {
    text = 'Loading...';
  }

  return {text};
};

const LoadingContainer = connect(
    mapStateToProps
)(FullScreenMessage);

export default LoadingContainer;