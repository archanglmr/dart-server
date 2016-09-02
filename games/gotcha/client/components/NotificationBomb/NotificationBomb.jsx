'use strict';

import React, {PropTypes} from 'react';
import './NotificationBomb.scss';
import SVGBomb from './SVGBomb.jsx';


class NotificationBomb extends React.Component {
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
    var {data, status, onFinish} = this.props,
        text = data ? data.name : '';

    if ('init' === status || 'finished' === status) {
      this.clearTimer();
    }
    if (text) {
      if (onFinish) {
        this.timer = setTimeout(onFinish, 1500);
      }
      let styles = {display: 'none'};
      if ('run' === status) {
        styles.display = '';
      }

      return (
          <div className="notification-bomb" data-status={status} style={styles}>
            <SVGBomb text={text} />
          </div>);
    }
    return null;
  }
}

NotificationBomb.propTypes = {
  data: PropTypes.object
};

export default NotificationBomb;