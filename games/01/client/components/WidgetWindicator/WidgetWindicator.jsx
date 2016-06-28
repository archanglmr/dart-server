'use strict';

import React, {PropTypes} from 'react';
import './WidgetWindicator.scss';


function WidgetWindicator({throws, limit}) {
  var throwElements = [],
      throwsLength = throws.length,
      className = ['widget-windicator'];

  if (throwsLength) {
    for (let i = 0; i < limit; i += 1) {
      if (i < throwsLength) {
        throwElements.push(<span key={i}>{formatThrowData(throws[i][0])}</span>);
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

WidgetWindicator.propTypes = {
  throws: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          number: PropTypes.number.isRequired,
          type: PropTypes.string.isRequired
        })
      )
  ).isRequired,
  limit: PropTypes.number.isRequired
};

export default WidgetWindicator;




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

    formatted += '-' + ((21 === throwData.number) ? 'BULL' : throwData.number);
  }
  return formatted;
}