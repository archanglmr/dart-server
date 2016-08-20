'use strict';

import React, {PropTypes} from 'react';
import PlayerScore from '../PlayerScore';
import './WidgetPlayer.scss';


function WidgetPlayer({id, displayName, score, current, className, player, valueComponent}) {
  var classNames = ['widget-player', 'player_id_' + id],
      value = null;
  if (current) {
    classNames.push('current');
  }
  if (className) {
    classNames.push(className);
  }
  if (valueComponent) {
    value = React.createElement(valueComponent, {player});
  } else {
    value = <PlayerScore player={player} />
  }
  return (
      <div className={classNames.join(' ')}>
        <div className="heading">{displayName}</div>
        {value}
      </div>
  );
}

WidgetPlayer.propTypes = {
  id: PropTypes.number.isRequired,
  displayName: PropTypes.string.isRequired,
  score: PropTypes.number,
  current: PropTypes.bool,
  valueComponent: PropTypes.func
};

export default WidgetPlayer;