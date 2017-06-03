'use strict';

import React, {PropTypes} from 'react';
import './NotificationSlide.scss';
import 'gsap';

import SOUND_SLIDE from 'base64!./sounds/slide.mp3'; // https://www.freesound.org/people/joedeshon/sounds/79677/

class NotificationSlide extends React.Component {
  componentWillUnmount() {
    this.destroyAnimation();
  }

  componentDidMount() {
    this.buildAnimation();
  }

  componentDidUpdate() {
    var {status} = this.props;

    if ('run' === status) {
      this.audio.play();
    } else if ('init' === status) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
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
          <div ref={div => this.container = div} className="notification-slide-container">
            Slide...
            <span ref={span => this.number = span} className="notification-slide-number">{data.oldTarget}</span>
          </div>
          <audio ref={audio => this.audio = audio} key="notification-slide-sound" preload="auto" src={'data:audio/mpeg;base64,' + SOUND_SLIDE} />
        </div>
    );
  }

  buildAnimation() {
    this.animation = new TimelineLite({
        paused: true,
        onComplete: () => {
          if (this.props.onFinish) {
            this.props.onFinish();
          }
          this.resetAnimation();
        }
      })
      .set(this.container, {left: '100vw'})
      .set(this.number, {scale: 1.1})
      .to(this.container, .5, {left: '0vw'})
      .call(() => {
          this.number.innerText = this.props.data.newTarget;
        }, null, this, '+=.5')
      .to(this.number, .5, {scale: .9})
      .to(this.container, .5, {left: '-100vw'}, '+=.5');
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