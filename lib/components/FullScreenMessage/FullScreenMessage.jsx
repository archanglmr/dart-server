'use strict';

import React, {PropTypes} from 'react';
import './FullScreenMessage.scss';


class FullScreenMessage extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.audioId = null;

    if (props.text && props.sound) {
      this.audioId = 'full-screen-message-' + props.text.toLowerCase().replace(/ /g, '-').replace(/[!-a-z0-9]/g, '');
    }
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
    var {text, status, onFinish} = this.props;

    if ('init' === status || 'finished' === status) {
      this.clearTimer();
    }

    if (this.audioId) {
      let el = document.getElementById(this.audioId);
      if (el) {
        if ('run' === status) {
          el.play();
        } else if ('init' === status) {
          el.pause();
          el.currentTime = 0;
        }
      }
    }
  }

  render() {
    var {text, status, onFinish, className, sound} = this.props,
        classNames = ['full-screen-message'],
        audio = null;

    if (className) {
      classNames.push(className);
    }

    if (this.audioId) {
      audio = <audio key={this.audioId} id={this.audioId} preload="auto" src={sound} />;
    }

    if (text) {
      if (status) {
        if ('init' === status || 'finished' === status) {
          this.clearTimer();
        }
        // only do timer stuff if there is a status
        if (onFinish) {
          this.timer = setTimeout(onFinish, 1500);
        }
        let styles = {display: 'none'};
        if ('run' === status) {
          styles.display = '';
        }

        return <div className={classNames.join(' ')} data-status={status} style={styles}><span>{text}</span>{audio}</div>;
      } else {
        return <div className={classNames.join(' ')}><span>{text}</span>{audio}</div>;
      }
    }
    return null;
  }

}

FullScreenMessage.propTypes = {
  text: PropTypes.string.isRequired,
  sound: PropTypes.string
};

export default FullScreenMessage;