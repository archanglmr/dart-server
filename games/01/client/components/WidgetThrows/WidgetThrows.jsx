'use strict';

import React, {PropTypes} from 'react';


function WidgetThrows({throws, limit}) {
  var throwElements = [],
      throwsLength = throws.length;

  for (let i = 0; i < limit; i += 1) {
    if (i < throwsLength) {
      throwElements.push(<span>{formatThrowData(throws[i])}</span>);
    } else {
      throwElements.push(<span>-=-&lt;&gt;</span>);
    }

    if ((1 + i) !== limit) {
      throwElements.push(' | ');
    }
  }
  return <div>{throwElements}</div>;
}

WidgetThrows.propTypes = {
  throws: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired
      })
  ).isRequired,
  limit: PropTypes.number.isRequired
};

export default WidgetThrows;




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