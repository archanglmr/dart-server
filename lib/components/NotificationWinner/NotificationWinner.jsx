'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationWinner({data}) {
  var name = data && data.name ? data.name : '';
  return <FullScreenMessage {...arguments[0]} onFinish={null} text={name + ' Wins!'} />;
}

export default NotificationWinner;