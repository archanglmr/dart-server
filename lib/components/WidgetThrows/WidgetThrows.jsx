'use strict';

import React, {PropTypes} from 'react';
import './WidgetThrows.scss';
import DartIcon from '../DartIcon';


function WidgetThrows({throws, limit, tempScore = false, noTempScore = false}) {
  var throwElements = [],
      throwsLength = throws.length,
      outlineOnly = false;

  for (let i = 0; i < limit; i += 1) {
    if (i < throwsLength) {
      throwElements.push(<span key={i}>{formatThrowData(throws[i])}</span>);
    } else {
      throwElements.push(<span key={i}><DartIcon outlineOnly={outlineOnly} current={!outlineOnly} /></span>);
      if (!outlineOnly) {
        outlineOnly = true;
      }
    }

    if ((1 + i) !== limit) {
      throwElements.push(' | ');
    }
  }
  if (false !== tempScore && true !== noTempScore) {
    throwElements.push(<span key="widget-throws-temp-score" className="temp-score"> = {tempScore}</span>);
  }
  return <div className="widget-throws">{throwElements}</div>;
}

WidgetThrows.propTypes = {
  throws: PropTypes.arrayOf(
      PropTypes.shape({
        number: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired
      })
  ).isRequired,
  limit: PropTypes.number.isRequired,
  tempScore: PropTypes.number,
  noTempScore: PropTypes.bool
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