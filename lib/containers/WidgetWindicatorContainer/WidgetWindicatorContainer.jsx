'use strict';

import {connect} from 'react-redux';
import WidgetWindicator from '../../components/WidgetWindicator';


const mapStateToProps = (state) => {
  return {
    throws: state.game.widgetWindicator,
    limit: state.rounds.throws
  };
};

const WidgetWindicatorContainer = connect(
    mapStateToProps
)(WidgetWindicator);

export default WidgetWindicatorContainer;