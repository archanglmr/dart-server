'use strict';

import React, {PropTypes} from 'react';
import './WidgetPlayer.scss';


function WidgetPlayer({id, displayName, score, current, className}) {
  var classNames = ['widget-player', 'player_id_' + id];
  if (current) {
    classNames.push('current');
  }
  if (className) {
    classNames.push(className);
  }
  return (
      <div className={classNames.join(' ')}>
        <div>{displayName}</div>
        {score}
      </div>
  );
}

WidgetPlayer.propTypes = {
  id: PropTypes.number.isRequired,
  displayName: PropTypes.string.isRequired,
  score: PropTypes.number,
  current: PropTypes.bool
};

export default WidgetPlayer;