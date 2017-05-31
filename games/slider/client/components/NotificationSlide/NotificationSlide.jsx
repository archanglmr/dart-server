'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './NotificationSlide.scss';
import 'gsap';

class NotificationSlide extends React.Component {
  componentWillUnmount() {
    this.destroyAnimation();
  }

  componentDidMount() {
    this.buildAnimation();
  }

  render() {
    var {data, status} = this.props,
        styles = {display: 'none'};

    if (!data) {
      data = {oldTarget: ''};
    }

    if ('init' === status || 'finished' === status) {
      this.resetAnimation();
    }
    if (data.oldTarget) {
      if ('run' === status) {
        styles.display = '';
        this.startAnimation();
      }
    }
    return (
        <div className="notification-slide" data-status={status} style={styles}>
          <div className="notification-slide-container">
            Slide...
            <span className="notification-slide-number">{data.oldTarget}</span>
          </div>
        </div>
    );
  }

  buildAnimation() {
    var container = ReactDOM.findDOMNode(this).getElementsByClassName('notification-slide-container')[0],
        number = ReactDOM.findDOMNode(this).getElementsByClassName('notification-slide-number')[0];

    this.animation = new TimelineLite({
        paused: true,
        onComplete: () => {
          if (this.props.onFinish) {
            this.props.onFinish();
          }
          this.resetAnimation();
        }
      })
      .set(container, {left: '100vw'})
      .set(number, {scale: 1.1})
      .to(container, .5, {left: '0vw'})
      .call(() => {
          number.innerText = this.props.data.newTarget;
        }, null, this, '+=.5')
      .to(number, .5, {scale: .9})
      .to(container, .5, {left: '-100vw'}, '+=.5');
  }

  destroyAnimation() {
    if (this.animation) {
      this.resetAnimation();
      this.animation = null;
    }
  }

  startAnimation() {
    this.animation.play();
  }

  resetAnimation() {
    if (this.animation) {
      this.animation.pause().seek(0);
    }
  }
}

NotificationSlide.propTypes = {
  data: PropTypes.object
};

export default NotificationSlide;