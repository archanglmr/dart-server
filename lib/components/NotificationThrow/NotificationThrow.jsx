'use strict';

import React, {PropTypes} from 'react';

import SOUND_BULL from 'base64!./sounds/bull.mp3'; // http://soundbible.com/1696-Train-Honk-Horn-Clear.html
import SOUND_DOUBLE_BULL from 'base64!./sounds/double_bull.mp3';
import SOUND_SINGLE from 'base64!./sounds/single.mp3';
import SOUND_DOUBLE from 'base64!./sounds/double.mp3';
import SOUND_TRIPLE from 'base64!./sounds/triple.mp3';
import SOUND_MISS from 'base64!./sounds/miss.mp3'; // https://www.freesound.org/people/erkanozan/sounds/51755/

class NotificationThrow extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.soundMap = {
      bull: 'data:audio/mpeg;base64,' + SOUND_BULL,
      double_bull: 'data:audio/mpeg;base64,' + SOUND_DOUBLE_BULL,
      single: 'data:audio/mpeg;base64,' + SOUND_SINGLE,
      double: 'data:audio/mpeg;base64,' + SOUND_DOUBLE,
      triple: 'data:audio/mpeg;base64,' + SOUND_TRIPLE,
      miss: 'data:audio/mpeg;base64,' + SOUND_MISS
    };
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  componentDidUpdate() {
    var {data, status, onFinish} = this.props,
        play = null;

    if ('init' === status || 'finished' === status) {
      this.clearTimer();
    } else if ('run' === status) {
      switch (data.type) {
        case 'SINGLE_INNER':
          play = 'single';
          break;

        case 'SINGLE_OUTER':
          play = (21 === data.number) ? 'bull' : 'single';
          break;

        case 'DOUBLE':
          play = (21 === data.number) ? 'double_bull' : 'double';
          break;

        case 'TRIPLE':
          play = 'triple';
          break;

        case 'MISS':
          play = 'miss';
          break;
      }

      if (onFinish) {
        // @todo: test this value more or possibly wait till the sound finished
        // to advance
        this.timer = setTimeout(onFinish, 750);
      }
    }

    for (let soundName in this.soundMap) {
      if (this.soundMap.hasOwnProperty(soundName)) {
        let el = document.getElementById('notification-throw-'+soundName);
        if (el) {
          if (soundName === play) {
            el.play();
          } else if ('init' === status) {
            el.pause();
            el.currentTime = 0;
          }
        }
      }
    }
  }

  render() {
    var components = [];

    for (let soundName in this.soundMap) {
      if (this.soundMap.hasOwnProperty(soundName)) {
        components.push(<audio key={'notification-throw-'+soundName} id={'notification-throw-'+soundName} preload="auto" src={this.soundMap[soundName]} />);
      }
    }

    return <div>{components}</div>;
  }
}

NotificationThrow.propTypes = {
  data: PropTypes.object
};

export default NotificationThrow;