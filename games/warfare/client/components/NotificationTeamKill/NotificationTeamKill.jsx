'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from 'components/FullScreenMessage';


function NotificationTeamKill() {
  return <FullScreenMessage {...arguments[0]} text="Team Kill!!!" />;
}

export default NotificationTeamKill;