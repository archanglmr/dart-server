'use strict';

import {connect} from 'react-redux';
import WidgetThrows from '../../components/WidgetThrows';


const mapStateToProps = (state) => {
  return {
    throws: state.widgetThrows,
    limit: state.rounds.throws,
    tempScore: state.game.tempScore
  };
};

const WidgetThrowsContainer = connect(
    mapStateToProps
)(WidgetThrows);

export default WidgetThrowsContainer;