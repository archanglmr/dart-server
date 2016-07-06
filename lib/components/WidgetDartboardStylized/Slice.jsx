'use strict';

import React, {PropTypes} from 'react';


function updateClassNames({classNames, addClass, target}) {
  if (target) {
    let addToScore = false;
    for (let i = 0, c = target.length; i < c; i += 1) {
      switch(target[i].type) {
        case 'TRIPLE':
          classNames.triple.push(addClass);
          addToScore = true;
          break;

        case 'DOUBLE':
          classNames.double.push(addClass);
          addToScore = true;
          break;

        case 'SINGLE_OUTER':
          classNames.outer.push(addClass);
          addToScore = true;
          break;

        case 'SINGLE_INNER':
          classNames.inner.push(addClass);
          addToScore = true;
          break;
      }
    }
    if (addToScore) {
      classNames.score.push(addClass);
    }
  }

  return classNames;
}

function Slice({dark, number, degrees, hide, blink, highlight}) {
  var classNames = {
    sector: ['sector', ('sector_' + number), (dark ? 'dark' : 'light')],
    inner: ['single', 'little', 'small', 'inner'],
    outer: ['single', 'fat', 'outer'],
    double: ['double'],
    triple: ['triple'],
    score: ['score']
  };

  classNames = updateClassNames({classNames, addClass: 'hide', target: hide});
  classNames = updateClassNames({classNames, addClass: 'blink', target: blink});
  classNames = updateClassNames({classNames, addClass: 'highlight', target: highlight});

  return (
      <g className={classNames.sector.join(' ')} transform={`translate(500 0) rotate(${degrees} 0 500)`}>
        <path className={classNames.inner.join(' ')} d="M562.37,309.91,528.43,414.59A89.66,89.66,0,0,0,500,410V300A200,200,0,0,1,562.37,309.91Z" transform="translate(-500, -15)" />
        <path className={classNames.outer.join(' ')} d="M608.64,167.19l-30.85,95.15A249.73,249.73,0,0,0,500,250V150A349.64,349.64,0,0,1,608.64,167.19Z" transform="translate(-500, -25)" />
        <path className={classNames.double.join(' ')} d="M624.07,119.62l-15.43,47.57A349.64,349.64,0,0,0,500,150V100A399.43,399.43,0,0,1,624.07,119.62Z" transform="translate(-500, -30)" />
        <path className={classNames.triple.join(' ')} d="M577.79,262.34l-15.42,47.57A200,200,0,0,0,500,300V250A249.73,249.73,0,0,1,577.79,262.34Z" transform="translate(-500, -20)" />
        <text className={classNames.score.join(' ')} textAnchor="middle" alignmentBaseline="middle" transform={`translate(65 18) rotate(${360 - degrees})`}>{number}</text>
      </g>
  );
}

Slice.propTypes = {
  dark: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  degrees: PropTypes.number.isRequired
};

export default Slice;