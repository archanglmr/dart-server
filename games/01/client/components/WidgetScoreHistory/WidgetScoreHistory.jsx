'use strict';

import React, {PropTypes} from 'react';
import './WidgetScoreHistory.scss';


function WidgetScoreHistory({history, roundLimit, displayLimit}) {
  var rendered = [],
      historyLength = history.length,
      offset = 0,
      limit = roundLimit;

  if (displayLimit) {
    if (historyLength > displayLimit) {
      offset = historyLength - displayLimit;
      limit = historyLength;
    } else {
      limit = displayLimit;
    }
  }

  for (; offset < limit; offset += 1) {
    if (offset <= historyLength) {
      rendered.push(
          <div key={offset}>
            <span>R{offset + 1}</span>
            <span>{history[offset]}</span>
          </div>
      );
    } else {
      rendered.push(
        <div key={offset} className="empty">
          <span>R{offset + 1}</span>
          <span>&nbsp;</span>
        </div>
      );
    }
  }
  return (
      <section className="widget-score-history">
        {rendered}
      </section>
  );
}

WidgetScoreHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.number).isRequired,
  roundLimit: PropTypes.number.isRequired
};

export default WidgetScoreHistory;