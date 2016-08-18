'use strict';

import React, {PropTypes} from 'react';
import NotificationThrow from '../NotificationThrow';


function WidgetNotificationQueue({notifications}) {

  if (notifications && notifications.length) {
    // @todo: Cancel all existing notifications
    for (let i = 0, c = notifications.length; i < c; i += 1) {
      let notification = notifications[i];
      console.log('NOTIFICATION:', notification);

      switch (notification.type) {
        case 'throw':
          return <NotificationThrow data={notification.data} />;
      }
    }
  }

  return null;
}

WidgetNotificationQueue.propTypes = {
  notifications: PropTypes.array
};


export default WidgetNotificationQueue;


// turn_end
// turn_start
// round_end
// round_start