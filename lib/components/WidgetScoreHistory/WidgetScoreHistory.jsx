'use strict';

import React, {PropTypes} from 'react';
import './WidgetScoreHistory.scss';

import WidgetRoundsContainer from 'containers/WidgetRoundsContainer';


function WidgetScoreHistory({history, roundLimit, displayLimit, valueComponent}) {
  var rendered = [],
      historyLength = history.length,
      offset = 0,
      limit = roundLimit;

  if (roundLimit && roundLimit < displayLimit) {
    displayLimit = roundLimit;
  }

  if (displayLimit) {
    if (historyLength > displayLimit) {
      offset = historyLength - displayLimit;
      limit = historyLength;
    } else {
      limit = displayLimit;
    }
  }

  for (; offset < limit; offset += 1) {
    let value = <span className="value" />;
    if (offset < historyLength) {
      let current = history[offset];
      if (valueComponent) {
        value = React.createElement(valueComponent, {history: current});
      } else {
        value = <span className="value">{current}</span>;
      }
    }

    rendered.push(
        <div key={offset} className={'row ' + (offset + 1 === historyLength ? 'current' : '')}>
          <span className="round">R{offset + 1}</span>
          {value}
        </div>
    );


    //<span className="value">{(offset <= historyLength) ? history[offset] : ''}</span>
  }
  return (
      <section className="widget-score-history">
        <WidgetRoundsContainer />
        {rendered}
      </section>
  );
}

WidgetScoreHistory.propTypes = {
  history: PropTypes.array.isRequired,

  //history: PropTypes.arrayOf(PropTypes.number).isRequired,
  roundLimit: PropTypes.number.isRequired,
  displayLimit: PropTypes.number,
  valueComponent: PropTypes.func
};

export default WidgetScoreHistory;