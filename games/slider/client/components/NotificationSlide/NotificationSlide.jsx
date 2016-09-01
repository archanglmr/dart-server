'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from 'components/FullScreenMessage';


function NotificationSlide() {
  return <FullScreenMessage {...arguments[0]} text="Slide!!!" />;
}

export default NotificationSlide;