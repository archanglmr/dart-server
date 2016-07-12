'use strict';

import {connect} from 'react-redux';
import WidgetWindicatorSmallList from '../../components/WidgetWindicatorSmallList';


const mapStateToProps = (state) => {
  let opponentWindicators = state.game.opponentWindicators;
  return {opponentWindicators: opponentWindicators, limit: state.rounds.throws};
};

const WidgetWindicatorSmallContainer = connect(
    mapStateToProps
)(WidgetWindicatorSmallList);

export default WidgetWindicatorSmallContainer;
