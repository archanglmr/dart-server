'use strict';

import React, {PropTypes} from 'react';
import WidgetWindicatorSmall from '../WidgetWindicatorSmall';
import './WidgetWindicatorSmallList.scss';

function WidgetWindicatorSmallList({opponentWindicators, limit}) {
    console.log("windicators", opponentWindicators);
  var className = ['widget-windicator-small-list'];
  if (opponentWindicators.length > 4) {
    className.push('compact');
  }
  let opponentWindicatorsWithLimit = opponentWindicators.map((o) => Object.assign(o, {limit: limit}));
    console.log("windicatorsL", opponentWindicatorsWithLimit);
  return (
      <div className={className.join(' ')}>
        {opponentWindicatorsWithLimit.map((opponentWindicator, index) => (
            <WidgetWindicatorSmall
                key={opponentWindicator.player.id}
                {...opponentWindicator}
                className={'opponentWindicator_' + (index + 1)}
              />
        ))}
      </div>
  );
}

WidgetWindicatorSmallList.propTypes = {
  opponentWindicator: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.number.isRequired
      )
  ).isRequired
};

export default WidgetWindicatorSmallList;
