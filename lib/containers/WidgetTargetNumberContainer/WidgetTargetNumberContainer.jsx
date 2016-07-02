'use strict';

import {connect} from 'react-redux';
import WidgetTempScore from '../../components/WidgetTempScore';


const mapStateToProps = (state) => {
  if (state.game) {
    // pre-pending '' to prevent warning since score is typically a number
    return {
      text: '' + state.game.target,
      hide: state.finished,
      label: 'Target:',
      className: 'target-number-container'
    };
  }
  return {hide: true};
};

const WidgetTargetNumberContainer = connect(
    mapStateToProps
)(WidgetTempScore);

export default WidgetTargetNumberContainer;