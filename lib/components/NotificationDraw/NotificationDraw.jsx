'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationDraw() {
  return <FullScreenMessage {...arguments[0]} onFinish={null} text="DRAW" />;
}

export default NotificationDraw;