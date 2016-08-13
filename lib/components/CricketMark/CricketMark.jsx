'use strict';

import React, {PropTypes} from 'react';
import './CricketMark.scss';


function CricketMark({marks, defaultText = '', highlight = 0}) {
  var maxMarks = Math.min(marks, 3),
      className = {
        svg: ['cricket-mark', 'c' + Math.min(3, marks)],
        mark1: ['c1'],
        mark2: ['c2'],
        mark3: ['c3']
      },
      highlightFrom = null;

  if (highlight <= maxMarks) {
    highlightFrom = Math.max(0, maxMarks - highlight);
  }

  for (let i = highlightFrom; i < maxMarks; i += 1) {
    className['mark' + (i + 1)].push('highlight');
  }

  return (
      <svg className={className.svg.join(' ')} version="1.1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
        <text className="c0" x="50" y="85" textAnchor="middle" fontSize="100">{defaultText}</text>
        <g transform={`rotate(45, 50, 50)`}>
          <line className={className.mark1.join(' ')} x1="50" x2="50" y1="5" y2="95" />
          <line className={className.mark2.join(' ')} x1="5" x2="95" y1="50" y2="50" />
          <circle className={className.mark3.join(' ')} cx="50" cy="50" r="30"></circle>
        </g>
      </svg>
  );
}

CricketMark.propTypes = {
  marks: PropTypes.number.isRequired,
  highlight: PropTypes.number,
  defaultText: PropTypes.string
};

export default CricketMark;