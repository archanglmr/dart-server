'use strict';

import React, {PropTypes} from 'react';
import './CornerDash.scss';


function CornerDash({children}) {
  return <div className="corner-dash">{children}</div>;
}


export default CornerDash;