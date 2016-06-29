'use strict';

import {connect} from 'react-redux';
import WidgetCurrentScore from '../../components/WidgetCurrentScore';


const mapStateToProps = (state) => {
  // pre-pending '' to prevent warning since score is typically a number
  return {text: '' + state.game.players[state.players.current].score};
};

const WidgetCurrentScoreContainer = connect(
    mapStateToProps
)(WidgetCurrentScore);

export default WidgetCurrentScoreContainer;