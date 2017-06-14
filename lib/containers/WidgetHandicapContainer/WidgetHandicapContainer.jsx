'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from 'components/WidgetTempScore';


const mapStateToProps = (state) => {
  if (state.game && 1 !== state.game.players[state.players.current].handicap) {
    // pre-pending '' to prevent warning since score is typically a number
    return {
      text: '' + state.game.players[state.players.current].handicap + 'x',
      hide: state.finished,
      label: 'Handicap:',
      className: 'handicap-container'
    };
  }
  return {hide: true};
};

const WidgetHandicapContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default WidgetHandicapContainer;