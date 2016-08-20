'use strict';

import React, {PropTypes} from 'react';
import './ScoreHistoryUpDown.scss';

function ScoreHistoryUpDown({history}) {
  var display = '0';
  if (history > 0) {
    display = `+${history}`;
  } else if (history < 0) {
    display = history;
  }
  return <span className="value score-history-up-down">{display}</span>;
}

ScoreHistoryUpDown.propTypes = {
  history: PropTypes.number.isRequired
};

export default ScoreHistoryUpDown;