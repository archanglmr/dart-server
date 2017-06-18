'use strict';

import React, {Component, PropTypes} from 'react';
import {
    GAME_MENU_KEY_PREVIOUS, GAME_MENU_KEY_NEXT, GAME_MENU_KEY_PARENT, GAME_MENU_KEY_CHILD,
    GAME_ACTION_UNTHROW, GAME_ACTION_REPLAY, GAME_ACTION_END_GAME
} from '../../display/actions';
import './GameMenu.scss';


export default class GameMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: 0,
      left: 0,
      width: 1280,
      height: 720
    };

    this.windowResize = this.windowResize.bind(this);
    this.windowKeydown = this.windowKeydown.bind(this);
  }


  /**
   * When the window resizes we need to re-scale our component.
   */
  windowResize() {
    var viewportWidth = document.documentElement.clientWidth,
        viewportHeight = document.documentElement.clientHeight,
        width, height;


    height = Math.floor(viewportWidth * (9 / 16));
    if (height > viewportHeight) {
      // computed height is to tall, we should do with width instead
      height = viewportHeight;
      width = Math.floor(viewportHeight * (16 / 9));
    } else {
      // computed height was fine to use with the max width
      width = viewportWidth;
    }

    this.setState({
      top: Math.max(0, (viewportHeight - height) / 2),
      left: Math.max(0, (viewportWidth - width) / 2),
      width: width,
      height: height
    });
  }

  /**
   * When the window resizes we need to re-scale our component.
   */
  windowKeydown(e) {
    switch(e.key) {
      case 'ArrowUp':
          // prev
        console.log('Key: Previous Item');
        this.submitKey(GAME_MENU_KEY_PREVIOUS);
        e.preventDefault();
        break;

      case 'ArrowDown':
        // next
        console.log('Key: Next Item');
        this.submitKey(GAME_MENU_KEY_NEXT);
        e.preventDefault();
        break;

      case 'ArrowRight':
      case 'Enter':
      case 'Space':
        // forward
        console.log('Key: Drill Down to Child');
        this.submitKey(GAME_MENU_KEY_CHILD);
        e.preventDefault();
        break;

      case 'ArrowLeft':
      case 'Escape':
        // back
        console.log('Key: Parent');
        this.submitKey(GAME_MENU_KEY_PARENT);
        e.preventDefault();
        break;


      /* Shortcuts */
      case 'U':
        console.log('Unthrow Last Dart');
          this.submitKey(GAME_ACTION_UNTHROW);
        e.preventDefault();
        break;

      default:
        console.log(e);
        e.preventDefault();
        break;
    }
  }

  /**
   * Makes the AJAX request to the server
   * @param key
   */
  submitKey(key) {
    console.log('Send:', key);
    fetch('/api/menu', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({key})
      })
      // @todo: add .catch() for error handling
      .then(response =>  response.json())
      .then(json => console.log('key response:', json))
  }

  componentDidMount() {
    window.addEventListener('resize', this.windowResize);
    window.addEventListener('keydown', this.windowKeydown);
    this.windowResize();
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.windowResize);
    window.removeEventListener('keydown', this.windowKeydown);
  }

  render () {
    var lightboxStyles = {
      opacity: this.props.visible ? 1 : 0
    },
    menuContaierStyles = {
      top: this.state.top + 'px',
      left: this.state.left + 'px',
      width: this.state.width + 'px',
      height: this.state.height + 'px'
    };

    return (
        <div className="game-menu" style={lightboxStyles}>
          <div style={menuContaierStyles}>
            <ul>
              {this.props.menu.map((item, index) => {
                let classNames = [];
                if (item.title) {
                  classNames.push('title');
                } else if (!item.enabled) {
                  classNames.push('disabled');
                } else if (item.highlighted) {
                  classNames.push('highlight');
                }

                return (<li key={'menu_item_' + index} className={classNames.join(' ')}>{item.label}</li>);
              })}
            </ul>
          </div>
        </div>
    );
  }
}