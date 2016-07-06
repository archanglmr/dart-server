'use strict';

import {connect} from 'react-redux';
import WidgetDartboardStylized from '../../components/WidgetDartboardStylized';


const mapStateToProps = (state) => {
  return {dartboard: state.widgetDartboard};
};

const WidgetDartboardContainer = connect(
    mapStateToProps
)(WidgetDartboardStylized);

export default WidgetDartboardContainer;