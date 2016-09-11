'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from 'components/FullScreenMessage';
import './NotificationCombo.scss';


function NotificationCombo({data}) {
  var number = (data || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return <FullScreenMessage {...arguments[0]} className="notification-combo" text={number + ' Point Combo!!!'} />;
}

export default NotificationCombo;