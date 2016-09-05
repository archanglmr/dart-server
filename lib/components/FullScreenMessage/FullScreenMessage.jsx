'use strict';

import React, {PropTypes} from 'react';
import './FullScreenMessage.scss';


class FullScreenMessage extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
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

  render() {
    var {text, status, onFinish, className} = this.props,
        classNames = ['full-screen-message'];

    if (className) {
      classNames.push(className);
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

        return <div className={classNames.join(' ')} data-status={status} style={styles}><span>{text}</span></div>;
      } else {
        return <div className={classNames.join(' ')}><span>{text}</span></div>;
      }
    }
    return null;
  }

}

FullScreenMessage.propTypes = {
  text: PropTypes.string.isRequired
};

export default FullScreenMessage;