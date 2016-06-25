'use strict';

import React, {PropTypes} from 'react';
import WidgetPlayer from '../WidgetPlayer';

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
        current: PropTypes.boolean
      })
  ).isRequired
};

export default WidgetPlayerList;