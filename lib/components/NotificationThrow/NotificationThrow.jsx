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
      }
      return <Sound url="/sounds/single.mp3" playStatus={Sound.status.PLAYING} />;

    case 'DOUBLE':
      if (21 === data.number) {
        return <Sound url="/sounds/double_bull.mp3" playStatus={Sound.status.PLAYING}/>;
      }
      return <Sound url="/sounds/double.mp3" playStatus={Sound.status.PLAYING} />;

    case 'TRIPLE':
      return <Sound url="/sounds/triple.mp3" playStatus={Sound.status.PLAYING} />;

    case 'MISS':
      return <Sound url="/sounds/miss.mp3" playStatus={Sound.status.PLAYING} />;
  }

  return null;
}

NotificationThrow.propTypes = {
  data: PropTypes.object
};

export default NotificationThrow;