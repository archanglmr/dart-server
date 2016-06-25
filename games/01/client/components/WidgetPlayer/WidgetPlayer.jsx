'use strict';

import React, {PropTypes} from 'react';
import './WidgetPlayer.scss';


function WidgetPlayer({id, displayName, score, current}) {
  var className = ['widget-player'];
  if (current) {
    className.push('current');
  }
  return (
      <div className={className.join(' ')}>
        <div>{displayName}</div>
        {score}
      </div>
  );
}

WidgetPlayer.propTypes = {
  id: PropTypes.number.isRequired,
  displayName: PropTypes.string.isRequired,
  score: PropTypes.number,
  current: PropTypes.boolean
};

export default WidgetPlayer;