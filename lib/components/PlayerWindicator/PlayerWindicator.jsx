'use strict';

import React, {PropTypes} from 'react';
import './PlayerWindicator.scss';


function PlayerWindicator({player}) {
  return <span className="player-windicator">{player.score}</span>;
}

PlayerWindicator.propTypes = {
  player: PropTypes.object
};

export default PlayerWindicator;