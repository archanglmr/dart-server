'use strict';

import React, {PropTypes} from 'react';
import './WidgetTempScore.scss';


function WidgetTempScore({text, gameOver}) {
  var className = ['widget-temp-score'];
  if (gameOver) {
    className.push('hidden');
  }
  return (
      <div className={className.join(' ')}>
        <div>Temp Score:</div>
        {text}
      </div>
  );
}

WidgetTempScore.propTypes = {
  text: PropTypes.string.isRequired,
  gameOver: PropTypes.bool.isRequired
};

export default WidgetTempScore;