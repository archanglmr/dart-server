'use strict';

import {connect} from 'react-redux';
import WidgetDartboard from '../../components/WidgetDartboard';


const mapStateToProps = (state) => {
  return {dartboard: state.widgetDartboard};
};

const WidgetDartboardContainer = connect(
    mapStateToProps
)(WidgetDartboard);

export default WidgetDartboardContainer;