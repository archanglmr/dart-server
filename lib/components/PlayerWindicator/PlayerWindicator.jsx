'use strict';

import React, {PropTypes} from 'react';
import './PlayerWindicator.scss';


function PlayerWindicator({player}) {
  var windicator = player.meta.bombWindicator,
      classNames = ['player-windicator'],
      throwElements = [],
      formatted = null;
  if (windicator.length && windicator[0].length) {
    classNames.push('winable');
    let win = windicator[0];
    for (let i = 0, c = win.length; i < c; i += 1) {
      throwElements.push(<span key={'winable_' + player.id + '_' + i}>{formatThrowData(win[i])} </span>);
    }
    formatted = <div className="tie-windicator">{throwElements}</div>;
  }
  return (
      <div className={classNames.join(' ')}>
        <span className="score">{player.score}</span>
        {formatted}
      </div>
  );
}

PlayerWindicator.propTypes = {
  player: PropTypes.object
};

export default PlayerWindicator;


/**
 * Formats a throwData object into a small string
 *
 * @param throwData {{type: string, number: number}}
 * @returns {string}
 */
function formatThrowData(throwData) {
  var formatted = '';

  if (0 === throwData.number) {
    formatted = 'MISS';
  } else {
    switch(throwData.type) {
      case 'DOUBLE':
        formatted = 'D';
        break;

      case 'TRIPLE':
        formatted = 'T';
        break;

      default:
        formatted = 'S';
        break;
    }

    formatted += ((21 === throwData.number) ? 'B' : throwData.number);
  }
  return formatted;
}