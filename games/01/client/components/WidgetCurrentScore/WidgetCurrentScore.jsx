'use strict';

import React, {PropTypes} from 'react';
import './WidgetCurrentScore.scss';


function WidgetCurrentScore({text}) {
  return <div className="widget-current-score">{text}</div>;
}

WidgetCurrentScore.propTypes = {
  text: PropTypes.string.isRequired
};

export default WidgetCurrentScore;