'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationTonHigh() {
  return <FullScreenMessage {...arguments[0]} text="High Ton!!" />;
}

export default NotificationTonHigh;