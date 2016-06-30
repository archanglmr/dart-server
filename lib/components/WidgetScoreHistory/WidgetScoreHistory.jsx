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
    rendered.push(
        <div key={offset} className={offset + 1 === historyLength ? 'current' : ''}>
          <span className="round">R{offset + 1}</span>
          <span className="value">{(offset <= historyLength) ? history[offset] : ''}</span>
        </div>
    );
  }
  return (
      <section className="widget-score-history">
        {rendered}
      </section>
  );
}

WidgetScoreHistory.propTypes = {
  history: PropTypes.array.isRequired,
  //history: PropTypes.arrayOf(PropTypes.number).isRequired,
  roundLimit: PropTypes.number.isRequired
};

export default WidgetScoreHistory;