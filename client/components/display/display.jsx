'use strict';

import React, {Component} from 'react';
import './display.scss';


export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            top: 0,
            left: 0,
            width: 1280,
            height: 720
        };

        this.windowResize = this.windowResize.bind(this);
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
            src: this.props.src,
            top: Math.max(0, (viewportHeight - height) / 2),
            left: Math.max(0, (viewportWidth - width) / 2),
            width: width,
            height: height
        });
    }

    componentDidMount() {
        window.addEventListener('resize', this.windowResize);
        this.windowResize();
    }

    render () {
        var styles = {
            top: this.state.top + 'px',
            left: this.state.left + 'px',
            width: this.state.width + 'px',
            height: this.state.height + 'px'
        };
        return (
            <iframe src={this.state.src} style={styles} />
        );
    }
}