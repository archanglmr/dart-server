'use strict';

import React, {PropTypes} from 'react';
import Slice from './Slice.jsx';
import './WidgetDartboard.scss';


function WidgetDartboard({dartboard}) {
  var order = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5],
      className = ['widget-dartboard'];
  if (!dartboard.visible) {
    className.push('hidden');
  }


  return (
    <svg className={className.join(' ')} version="1.1" x="0px" y="0px" width="787px" height="774px" viewBox="0 0 787 774" enable-background="new 0 0 787 774">
      <g class="island">
        {order.map((value, i) => <Slice key={value} number={value} degrees={i * 18} dark={!!((i + 1) % 2)}/>)}
      </g>
      <g className="sector sector_bull" transform={`translate(-7.5, -2)`}>
        <path className="light single" d="M432.438 389c0 17.087-13.852 30.938-30.938 30.938S370.562 406.1 370.6 389 s13.852-30.938 30.938-30.938S432.438 371.9 432.4 389z M401.5 372.602c-9.057 0-16.398 7.342-16.398 16.4 s7.342 16.4 16.4 16.398s16.398-7.342 16.398-16.398S410.557 372.6 401.5 372.602z" />
        <circle className="dark double" cx="401.5" cy="389" r="13.7"></circle>
      </g>
    </svg>
  );
}

//394, 387

WidgetDartboard.propTypes = {
  dartboard: PropTypes.shape({
    visible: PropTypes.bool,
    hide: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        number: PropTypes.number
      })
    ),
    blink: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        number: PropTypes.number
      })
    ),
    highlight: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        number: PropTypes.number
      })
    )
  })
};

export default WidgetDartboard;