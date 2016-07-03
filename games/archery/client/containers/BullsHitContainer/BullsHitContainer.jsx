'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from 'components/WidgetTempScore';


const mapStateToProps = (state) => {
  // pre-pending '' to prevent warning since score is typically a number
  return {
    text: '' + state.game.players[state.game.currentPlayer].bulls,
    label: 'Bulls Hit:'
  };
};

const BullsHitContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default BullsHitContainer;