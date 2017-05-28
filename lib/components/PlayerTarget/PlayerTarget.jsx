'use strict';

import React, {PropTypes} from 'react';


function PlayerTarget({player}) {
  var display = player.score;
  if (player.meta.winner) {
    display = '☺';
  } else if (21 === player.score) {
    display = 'Bull';
  }
  return <span className="player-target">{display}</span>;
}

PlayerTarget.propTypes = {
  player: PropTypes.object
};

export default PlayerTarget;