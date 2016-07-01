'use strict';

import React, {PropTypes} from 'react';
import CricketMark from '../CricketMark';
import './ScoreHistoryCricket.scss';

function ScoreHistoryCricket({history}) {
  return <span className="value score-history-cricket" children={history.map(mark => <CricketMark marks={mark} defaultText="--" /> )} />;
}

ScoreHistoryCricket.propTypes = {
  history: PropTypes.array.isRequired
};

export default ScoreHistoryCricket;