'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from '../../components/WidgetTempScore';


const mapStateToProps = (state) => {
  if (state.game.players) {
    let score = state.game.players[state.players.current].score;
    // pre-pending '' to prevent warning since score is typically a number
    return {
      text: '' + score,
      hide: state.finished,
      label: 'Score:',
      className: 'score-container'
    };
  }
  return {hide: true};
};

const WidgetScoreContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default WidgetScoreContainer;