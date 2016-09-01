'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationHatTrick() {
  return <FullScreenMessage {...arguments[0]} text="Hat Trick!!!" />;
}

export default NotificationHatTrick;