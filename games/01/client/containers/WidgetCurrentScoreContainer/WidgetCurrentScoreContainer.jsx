'use strict';

import {connect} from 'react-redux';
import WidgetCurrentScore from 'components/WidgetCurrentScore';


const mapStateToProps = (state) => {
  var score = state.game.players[state.players.current].score;
  return {text: (score || 'WIN').toString()};
};

const WidgetCurrentScoreContainer = connect(
    mapStateToProps
)(WidgetCurrentScore);

export default WidgetCurrentScoreContainer;