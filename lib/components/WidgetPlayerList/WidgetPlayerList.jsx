'use strict';

import React, {PropTypes} from 'react';
import WidgetPlayer from '../WidgetPlayer';
import './WidgetPlayerList.scss';

function WidgetPlayerList({players}) {
  return (
      <div className="widget-player-list">
        {players.map((player) => (
            <WidgetPlayer
                key={player.id}
                {...player}
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
  ).isRequired
};

export default WidgetPlayerList;