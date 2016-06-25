'use strict';

import {connect} from 'react-redux';
import WidgetThrows from '../../components/WidgetThrows';


const mapStateToProps = (state) => {
  return {
    throws: state.widgetThrows,
    throwLimit: state.rounds.throws
  };
};

const WidgetThrowsContainer = connect(
    mapStateToProps
)(WidgetThrows);

export default WidgetThrowsContainer;