'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationGameOver() {
  return <FullScreenMessage {...arguments[0]} text="Game Over" />;
}

export default NotificationGameOver;