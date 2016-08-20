'use strict';

import React, {PropTypes} from 'react';
import NotificationThrow from '../NotificationThrow';
import NotificationTon from '../NotificationTon';
import NotificationHatTrick from '../NotificationHatTrick';
import NotificationThreeInBed from '../NotificationThreeInBed';
import NotificationThreeInBlack from '../NotificationThreeInBlack';


function WidgetNotificationQueue({notifications, customNotifications = {}}) {
  var components = [];

  console.log('custom:', customNotifications);
  if (notifications && notifications.length) {
    // @todo: Cancel all existing notifications
    for (let i = 0, c = notifications.length; i < c; i += 1) {
      let notification = notifications[i];
      console.log('NOTIFICATION:', notification);

      switch (notification.type) {
        case 'throw':
          components.push(<NotificationThrow key={notification.type} data={notification.data} />);
          break;

        case 'three_in_bed':
          console.log('Three in a Bed');
          components.push(<NotificationThreeInBed key={notification.type} />);
          break;

        case 'three_in_black':
          console.log('Three in the Black');
          components.push(<NotificationThreeInBlack key={notification.type} />);
          break;

        case 'hat_trick':
          console.log('Hat Trick');
          components.push(<NotificationHatTrick key={notification.type} />);
          break;

        case 'ton':
          console.log('Ton ' + notification.data);
          components.push(<NotificationTon key={notification.type} data={'' + notification.data} />);
          break;

        case 'remove_darts':
          console.log('Remove Darts');
          break;

        default:
          let customNotification = customNotifications[notification.type];

          if (customNotification) {
            components.push(customNotification({key: notification.type, data: notification.data}));
          } else {
            console.log('Unhandled');
          }
          break;
      }
    }
  }

  return (
      <div>{components}</div>
  );
}

WidgetNotificationQueue.propTypes = {
  notifications: PropTypes.array
};


export default WidgetNotificationQueue;


// turn_end
// turn_start
// round_end
// round_start