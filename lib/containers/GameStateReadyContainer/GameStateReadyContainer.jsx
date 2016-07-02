'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'react-redux';


function GameStateReady({state, children}) {
  if (state && state.started) {
    return <div>{children}</div>;
  }
  return <div></div>;
}


const mapStateToProps = (state) => {
  return {state};
};

const GameStateReadyContainer = connect(
    mapStateToProps
)(GameStateReady);

export default GameStateReadyContainer;