'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from '../../components/WidgetTempScore';


const mapStateToProps = (state) => {
  // pre-pending '' to prevent warning since score is typically a number
  return {
    text: '' + state.game.tempScore,
    hide: state.finished,
    label: 'Temp Score:'
  };
};

const WidgetTempScoreContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default WidgetTempScoreContainer;