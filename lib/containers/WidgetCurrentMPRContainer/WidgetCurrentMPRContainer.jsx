'use strict';

import {connect} from 'react-redux';
import WidgetCurrentMPR from '../../components/WidgetCurrentMPR';


const mapStateToProps = (state) => {
  var player = state.game.players[state.players.current],
      throws = player.throwHistory.length,
      marks = 0;

  for (let target in player.marks) {
    if (player.marks.hasOwnProperty(target)) {
      marks += player.marks[target];
    }
  }

  return {mpr: throws ? ((marks / throws) * 3) : 0};
};

const WidgetCurrentMPRContainer = connect(
    mapStateToProps
)(WidgetCurrentMPR);

export default WidgetCurrentMPRContainer;