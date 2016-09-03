'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';
import './NotificationRemoveDarts.scss';


function NotificationRemoveDarts() {
  return <FullScreenMessage {...arguments[0]} className="notification-remove-darts blink" onFinish={null} text="Remove Darts" />;
}

export default NotificationRemoveDarts;