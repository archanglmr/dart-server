'use strict';

import {connect} from 'react-redux';
import FullScreenMessage from '../../components/FullScreenMessage';


const mapStateToProps = (state) => {
  var text = '';

  if (state.winner) {
    text = 'CONFUSED...';
    if (-1 === state.winner) {
      text = 'DRAW';
    } else if (state.winner > 0) {
      let player = state.players.data[state.winner];
      if (player && player.displayName) {
        text = `${player.displayName} Wins!`;
      }
    }
  }


  return { text };
};

const WidgetWinnerContainer = connect(
    mapStateToProps
)(FullScreenMessage);

export default WidgetWinnerContainer;