'use strict';


var Display = React.createClass({
    updateSize: function() {
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
    },
    getInitialState: function() {
        return {
            top: 0,
            left: 0,
            width: 1280,
            height: 720
        };
    },
    componentDidMount: function() {
        window.addEventListener('resize', this.updateSize);
        this.updateSize();
    },
    render: function() {
        var styles = {
            top: this.state.top + 'px',
            left: this.state.left + 'px',
            width: this.state.width + 'px',
            height: this.state.height + 'px'
        };
        return (
            <iframe src={this.props.src} style={styles} />
        );
    }
});
// Render application.
ReactDOM.render(<Display src="/display/content" />, document.getElementById('body'));
