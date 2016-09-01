'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationWhiteHorse() {
  return <FullScreenMessage {...arguments[0]} text="White Horse!!!" />;
}

export default NotificationWhiteHorse;