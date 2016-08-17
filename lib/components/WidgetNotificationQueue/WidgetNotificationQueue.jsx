'use strict';

import React, {PropTypes} from 'react';
import Sound from 'react-sound';


function WidgetNotificationQueue({notifications}) {
console.log('args:', arguments);
  if (notifications && notifications.length) {
    // @todo: Cancel all existing notifications
    for (let i = 0, c = notifications.length; i < c; i += 1) {
      let notification = notifications[i];
      console.log('NOTIFICATION:', notification);
      switch (notification.type) {
        case 'throw':
            switch (notification.data.type) {
              case 'SINGLE_INNER':
              case 'SINGLE_OUTER':
                if (21 === notification.data.number) {
                  // http://soundbible.com/1696-Train-Honk-Horn-Clear.html
                  return <Sound url="/sounds/bull.mp3" playStatus={Sound.status.PLAYING} />;
                } else {
                  return <Sound url="/sounds/single.mp3" playStatus={Sound.status.PLAYING} />;
                }
                break;

              case 'DOUBLE':
                if (21 === notification.data.number) {
                  console.log('double bull');
                  return <Sound url="/sounds/double_bull.mp3" playStatus={Sound.status.PLAYING} />;
                } else {
                  console.log('double');
                  return <Sound url="/sounds/double.mp3" playStatus={Sound.status.PLAYING} />;
                }
                break;


              case 'TRIPLE':
                console.log('triple');
                return <Sound url="/sounds/triple.mp3" playStatus={Sound.status.PLAYING} />;
                break;

              case 'MISS':
                console.log('miss');
                return <Sound url="/sounds/miss.mp3" playStatus={Sound.status.PLAYING} />;
                break;
            }
          break;
      }
    }
  }

  return <div style={{display: 'none'}} />;
  //return (
  //    <div style={{display: 'none'}}>
  //      <audio preload src="/sounds/bull.mp3"></audio>
  //      <audio preload src="/sounds/double_bull.mp3"></audio>
  //      <audio preload src="/sounds/single.mp3"></audio>
  //      <audio preload src="/sounds/double.mp3"></audio>
  //      <audio preload src="/sounds/triple.mp3"></audio>
  //    </div>
  //);
}

WidgetNotificationQueue.propTypes = {
  notifications: PropTypes.array
};


export default WidgetNotificationQueue;


// turn_end
// turn_start
// round_end
// round_start

//<audio id="sound_miss" preload src="/sounds/miss.mp3"></audio>
//<audio id="sound_double_bull" preload src="/sounds/double_bull.mp3"></audio>
//<audio id="sound_outer_bull" preload src="/sounds/outer_bull.mp3"></audio>