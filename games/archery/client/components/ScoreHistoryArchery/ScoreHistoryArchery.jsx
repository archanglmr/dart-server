'use strict';

import React, {PropTypes} from 'react';
import ArcheryMark from '../ArcheryMark';
import './ScoreHistoryArchery.scss';

function ScoreHistoryArchery({history}) {
  var history = history || [];
  return <span className="value score-history-archery" children={history.map(mark => <ArcheryMark className={mark.markType} /> )} />;
}

ScoreHistoryArchery.propTypes = {
  history: PropTypes.array.isRequired
};

export default ScoreHistoryArchery;