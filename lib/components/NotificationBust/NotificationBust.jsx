'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationBust() {
  return <FullScreenMessage {...arguments[0]} text="B-U-S-T!!!" />;
}

export default NotificationBust;