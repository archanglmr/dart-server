'use strict';

import {connect} from 'react-redux';
import WidgetNotificationQueue from '../../components/WidgetNotificationQueue';


const mapStateToProps = (state) => {
  return { notifications: state.notificationQueue };
};

const WidgetNotificationQueueContainer = connect(
    mapStateToProps
)(WidgetNotificationQueue);

export default WidgetNotificationQueueContainer;