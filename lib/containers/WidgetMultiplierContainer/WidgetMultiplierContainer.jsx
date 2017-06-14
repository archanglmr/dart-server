'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from 'components/WidgetTempScore';


const mapStateToProps = (state) => {
  if (state.game) {
    // pre-pending '' to prevent warning since score is typically a number
    return {
      text: '' + state.game.players[state.players.current].multiplier + 'x',
      hide: state.finished,
      label: 'Multiplier:',
      className: 'multiplier-container'
    };
  }
  return {hide: true};
};

const WidgetMultiplierContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default WidgetMultiplierContainer;