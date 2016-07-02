'use strict';

import React, {PropTypes} from 'react';
import './WidgetTempScore.scss';


function WidgetTempScore({text, className, label, hide = false}) {
  var classNames = ['widget-temp-score'];
  if (className) {
    classNames.push(className);
  }
  if (hide) {
    classNames.push('hidden');
  }
  return (
      <div className={classNames.join(' ')}>
        <div>{label}</div>
        {text}
      </div>
  );
}

WidgetTempScore.propTypes = {
  text: PropTypes.string,
  hide: PropTypes.bool,
  className: PropTypes.string,
  label: PropTypes.string
};

export default WidgetTempScore;