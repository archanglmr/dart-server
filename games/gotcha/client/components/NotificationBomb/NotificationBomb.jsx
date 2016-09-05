'use strict';

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './NotificationBomb.scss';
import SVGBomb from './SVGBomb.jsx';
import SVGPow from './SVGPow.jsx';
import 'gsap';


class NotificationBomb extends React.Component {
  componentWillUnmount() {
    this.destroyAnimation();
  }

  componentDidMount() {
    this.buildAnimation();
  }

  render() {
    var {data, status} = this.props,
        text = data ? data.name : '',
        styles = {display: 'none'};

    if ('init' === status || 'finished' === status) {
      this.resetAnimation();
    }
    if (text) {
      if ('run' === status) {
        styles.display = '';
        this.startAnimation();
      }
    }
    return (
        <div className="notification-bomb" data-status={status} style={styles}>
          <SVGPow />
          <SVGBomb text={text} />
        </div>
    );
  }

  buildAnimation() {
    var bomb = ReactDOM.findDOMNode(this).getElementsByClassName('svg-bomb')[0],
        pow = ReactDOM.findDOMNode(this).getElementsByClassName('svg-pow')[0];

    this.animation = new TimelineLite({
          paused: true,
          onComplete: () => {
            if (this.props.onFinish) {
              this.props.onFinish();
            }
            this.resetAnimation();
          }
        })
        .set(bomb, {scale: 2})
        .set(pow, {scale: 0})
        .to(bomb, .25, {opacity: 1, scale: 1})
        .to(pow, .25, {opacity: 1, scale: 2}, '+=1')
        .set(bomb, {opacity: 0})
        .to(pow, .25, {opacity: 0});
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

NotificationBomb.propTypes = {
  data: PropTypes.object
};

export default NotificationBomb;