'use strict';

import React, {PropTypes} from 'react';
import './WidgetWindicatorSmall.scss';


function WidgetWindicatorSmall({player, value, limit}) {
  var throwElements = [],
      throwsLength = value.length,
      className = ['widget-windicator-small', 'opponentWindicator_' + player.id];

  if (throwsLength) {
    let currentThrow = value[0];
    let currentThrowLength = currentThrow.length;
    throwElements.push(<span key={'player' + player.id}>{player.id}</span>);
    for (let i = 0; i < limit; i += 1) {
      if (i < currentThrowLength) {
        throwElements.push(<span key={i}>{formatThrowData(currentThrow[i])}</span>);
      } else {
        throwElements.push(<span key={i} className="empty">----</span>);
      }

      if ((1 + i) !== limit) {
        throwElements.push(' | ');
      }
    }
  } else {
    className.push('empty');
  }


  return <div className={className.join(' ')}>{throwElements}</div>;
}

WidgetWindicatorSmall.propTypes = {
  player: PropTypes.shape({
        id: PropTypes.number.isRequired,
        displayName: PropTypes.string.isRequired,
        score: PropTypes.number,
        current: PropTypes.bool
      }),
  value: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          number: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired
        })
      )
  ).isRequired,
  limit: PropTypes.number.isRequired
};

export default WidgetWindicatorSmall;




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
        formatted = 'Double';
        break;

      case 'TRIPLE':
        formatted = 'Triple';
        break;

      default:
        formatted = 'Single';
        break;
    }

    formatted += ' ' + ((21 === throwData.number) ? 'Bull' : throwData.number);
  }
  return formatted;
}
