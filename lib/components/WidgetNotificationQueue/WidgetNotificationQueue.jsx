'use strict';

import React, {PropTypes} from 'react';
import NotificationThrow from '../NotificationThrow';
import NotificationTon from '../NotificationTon';
import NotificationHatTrick from '../NotificationHatTrick';
import NotificationThreeInBed from '../NotificationThreeInBed';
import NotificationThreeInBlack from '../NotificationThreeInBlack';
import NotificationGameOver from '../NotificationGameOver';


function WidgetNotificationQueue({notifications, customNotifications = {}}) {
  var components = [];

  if (notifications && notifications.length) {
    // @todo: Cancel all existing notifications
    for (let i = 0, c = notifications.length; i < c; i += 1) {
      let notification = notifications[i],
          customNotification = customNotifications[notification.type];
      console.log('NOTIFICATION:', notification);

      if (customNotification) {
        components.push(React.createElement(customNotification, {key: notification.type, data: notification.data}));
      } else {
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

          case 'game_over':
            console.log('Game Over');
            components.push(<NotificationGameOver key={notification.type} />);
            break;

          case 'remove_darts':
            console.log('Remove Darts');
            break;

          default:
            console.log('Unhandled');
            break;
        }
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