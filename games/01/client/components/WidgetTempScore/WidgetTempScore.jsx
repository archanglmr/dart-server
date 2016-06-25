'use strict';

import React, {PropTypes} from 'react';
import './WidgetTempScore.scss';


function WidgetTempScore({text}) {
  return (
      <div className="widget-temp-score">
        <div>Temp Score:</div>
        {text}
      </div>
  );
}

WidgetTempScore.propTypes = {
  text: PropTypes.string.isRequired
};

export default WidgetTempScore;