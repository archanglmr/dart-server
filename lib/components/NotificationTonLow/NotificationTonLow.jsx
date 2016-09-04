'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationTonLow() {
  return <FullScreenMessage {...arguments[0]} text="Low Ton!" />;
}

export default NotificationTonLow;