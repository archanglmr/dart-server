'use strict';

import React, {PropTypes} from 'react';
import './WidgetWinner.scss';


function WidgetWinner({winner, playersData}) {
  if (winner) {
    let text = 'CONFUSED...';
    if (-1 === winner) {
      text = 'DRAW';
    } else if (winner > 0) {
      let player = playersData[winner];
      if (player && player.displayName) {
        text = `${player.displayName} Wins!`;
      }

    }
    return <div className="widget-winner">{text}</div>;
  }
  return <div style={{display: 'none'}} />
}

WidgetWinner.propTypes = {
  winner: PropTypes.isRequired,
  playersData: PropTypes.object.isRequired
};

export default WidgetWinner;