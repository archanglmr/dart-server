'use strict';

import React, {PropTypes} from 'react';
import Sound from 'react-sound';


class NotificationThrow extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.play = null;
    this.soundMap = {
      bull: '/sounds/bull.mp3', // http://soundbible.com/1696-Train-Honk-Horn-Clear.html
      double_bull: '/sounds/double_bull.mp3',
      single: '/sounds/single.mp3',
      double: '/sounds/double.mp3',
      triple: '/sounds/triple.mp3',
      miss: '/sounds/miss.mp3'

    };
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  componentDidUpdate() {
    var {data, status, onFinish} = this.props,
        play = null;

    if ('run' === status) {
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
        this.timer = setTimeout(onFinish, 0);
      }
    }

    for (let soundName in this.soundMap) {
      if (this.soundMap.hasOwnProperty(soundName)) {
        let el = document.getElementById('notification_throw_'+soundName);
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
        components.push(<audio key={'notification_throw_'+soundName} id={'notification_throw_'+soundName} preload="auto" src={this.soundMap[soundName]} />);
      }
    }

    return <div>{components}</div>;
  }
}

NotificationThrow.propTypes = {
  data: PropTypes.object
};

export default NotificationThrow;