'use strict';

import React, {PropTypes} from 'react';
import './CricketMark.scss';


function CricketMark({marks, defaultText = ''}) {
  var className = ['cricket-mark', 'c' + Math.min(3, marks)];

  return (
      <svg className={className.join(' ')} version="1.1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100">
        <text className="c0" x="50" y="85" textAnchor="middle" fontSize="100">{defaultText}</text>
        <g transform={`rotate(45, 50, 50)`}>
          <line className="c1" x1="50" x2="50" y1="5" y2="95" />
          <line className="c2" x1="5" x2="95" y1="50" y2="50" />
          <circle className="c3" cx="50" cy="50" r="44"></circle>
        </g>
      </svg>
  );
}

CricketMark.propTypes = {
  marks: PropTypes.number.isRequired,
  defaultText: PropTypes.string
};

export default CricketMark;