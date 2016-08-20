'use strict';

import React, {PropTypes} from 'react';
import './ScoreHistoryNumber.scss';

function ScoreHistoryNumber({history}) {
  return <span className="value score-history-number">{history}</span>;
}

ScoreHistoryNumber.propTypes = {
  history: PropTypes.number.isRequired
};

export default ScoreHistoryNumber;