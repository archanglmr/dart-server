'use strict';

import React, {PropTypes} from 'react';
import Animate from 'rc-animate';
import NotificationThrow from '../NotificationThrow';
import NotificationGameOver from '../NotificationGameOver';

import NotificationTon from '../NotificationTon';
import NotificationHatTrick from '../NotificationHatTrick';
import NotificationThreeInBlack from '../NotificationThreeInBlack';

import NotificationThreeInBed from '../NotificationThreeInBed';


class WidgetNotificationQueue extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.notificationIndex = 0;
    this.forced = false;
  }

  //componentWillUpdate() {
  //  console.log('ABOUT TO UPDATE');
  //  console.log(' - index: ' + this.notificationIndex);
  //  console.log(' - forced: ' + this.forced);
  //}

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onFinish() {
    //console.log('finish');
    this.notificationIndex += 1;
    this.forced = true;
    this.forceUpdate();
  }


  render() {
    var notificationMap = {
          throw: NotificationThrow,
          three_in_black: NotificationThreeInBlack,
          hat_trick: NotificationHatTrick,
          three_in_bed: NotificationThreeInBed,
          ton: NotificationTon,
          game_over: NotificationGameOver
          //remove_darts:
        },
        customNotifications = this.props.customNotifications || {},

        notifications = this.props.notifications, // current notifications
        notificationStatuses = {},

        components = [];

    // combine standard and custom notifications
    for (let key in customNotifications) {
      if (customNotifications.hasOwnProperty(key)) {
        notificationMap[key] = customNotifications[key];
      }
    }

    if (this.forced) {
      let length = 0;
      //console.log('PLAY THESE:', notifications);
      // Build a list of notifications but with a status. We'll use the new list
      // when rendering.
      for (let i = 0, c = notifications.length; i < c; i += 1) {
        let notification = notifications[i],
            status = 'init';

        // filter for known notifications
        if (notificationMap[notification.type]) {
          // determine the current status of a user notification
          if (i < this.notificationIndex) {
            status = 'finished';
          } else if (i === this.notificationIndex) {
            status = 'run';
          }

          notificationStatuses[notification.type] = {status, notification};
          length += 1;
        } else {
          console.log('Unknown notification passed to WidgetNotificationQueue: ', notification);
        }
      }

      this.forced = false;
      //console.log('using these...', notificationStatuses);

      if (this.notificationIndex >= length) {
        this.notificationIndex = 0;
        //console.log('>>>RESET INDEX');
      }
    } else {
      //console.log('PLAY NONE');
      if (notifications.length) {
        //console.log(' - till next tick');
        this.timer = setTimeout(() => {
          this.forced = true;
          this.notificationIndex = 0;
          this.forceUpdate();
        }, 0);
      //} else {
      //  console.log(' - really, none');
      }
    }

    // render all the notifications with their current status.
    for (let key in notificationMap) {
      if (notificationMap.hasOwnProperty(key)) {
        let current = notificationStatuses[key];

        if (current) {
          components.push(React.createElement(notificationMap[key], {
            status: (current.status || 'init'),
            key: key,
            data: current.notification.data || null,
            onFinish: (('run' === current.status) ? this.onFinish.bind(this) : null)
          }));
        } else {
          components.push(React.createElement(notificationMap[key], {
            status: 'init',
            key: key
          }));
        }
      }
    }

    return <div id="widget-notification-queue">{components}</div>;
  }
}

WidgetNotificationQueue.propTypes = {
  notifications: PropTypes.array
};


export default WidgetNotificationQueue;


// turn_end
// turn_start
// round_end
// round_start