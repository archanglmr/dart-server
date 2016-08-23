'use strict';

import React, {PropTypes} from 'react';
import './ArcheryMark.scss';


function ArcheryMark({className}) {
  var classNames = ['archery-mark'];
  if (className) {
    classNames.push(className);
  }

  return (
      <svg className={classNames.join(' ')} version="1.1" x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
        <g>
          <text x="50" y="85" textAnchor="middle" fontSize="100">--</text>
          <circle cx="50" cy="50" r="30"></circle>
        </g>
      </svg>
  );
}

ArcheryMark.propTypes = {
  className: PropTypes.string
};

export default ArcheryMark;