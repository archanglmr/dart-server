'use strict';

import React, {PropTypes} from 'react';
import './WidgetCurrentScore.scss';


function WidgetCurrentScore({text}) {
  if ('0' === text.toString()) {
    return <div className="widget-current-score winner">WINNER!</div>;
  }
  return <div className="widget-current-score">{text}</div>;
}

WidgetCurrentScore.propTypes = {
  text: PropTypes.string.isRequired
};

export default WidgetCurrentScore;