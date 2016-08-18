'use strict';

import React, {PropTypes} from 'react';
import './FullScreenMessage.scss';


function FullScreenMessage({text}) {
  if (text) {
    return <div className="full-screen-message">{text}</div>;
  }
  return null;
}

FullScreenMessage.propTypes = {
  text: PropTypes.string.isRequired
};

export default FullScreenMessage;