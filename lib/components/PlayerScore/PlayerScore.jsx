'use strict';

import React, {PropTypes} from 'react';


function PlayerScore({player}) {
  return <span className="player-score">{player.score}</span>;
}

PlayerScore.propTypes = {
  player: PropTypes.object
};

export default PlayerScore;