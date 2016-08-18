'use strict';

import React, {PropTypes} from 'react';
import Sound from 'react-sound';


function NotificationThrow({data}) {
  switch (data.type) {
    case 'SINGLE_INNER':
    case 'SINGLE_OUTER':
      if (21 === data.number) {
        // http://soundbible.com/1696-Train-Honk-Horn-Clear.html
        return <Sound url="/sounds/bull.mp3" playStatus={Sound.status.PLAYING} />;
      } else {
        return <Sound url="/sounds/single.mp3" playStatus={Sound.status.PLAYING} />;
      }
      break;

    case 'DOUBLE':
      if (21 === data.number) {
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

  return <span style={{display: 'none'}} />;
}

NotificationThrow.propTypes = {
  data: PropTypes.object
};

export default NotificationThrow;