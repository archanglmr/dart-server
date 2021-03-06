'use strict';

import React, {PropTypes} from 'react';
import WidgetPlayer from '../WidgetPlayer';
import './WidgetPlayerList.scss';

function WidgetPlayerList({players, valueComponent}) {
  var className = ['widget-player-list'];
  if (players.length > 4) {
    className.push('compact');
  }
  return (
      <div className={className.join(' ')}>
        {players.map((player, index) => (
            <WidgetPlayer
                key={player.id}
                player={player}
                valueComponent={valueComponent}
                {...player}
                className={'player_' + (index + 1)}
              />
        ))}
      </div>
  );
}

WidgetPlayerList.propTypes = {
  players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
        score: PropTypes.number,
        current: PropTypes.bool
      })
  ).isRequired,
  valueComponent: PropTypes.func
};

export default WidgetPlayerList;