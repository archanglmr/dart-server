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
      <g className={classNames.sector.join(' ')} transform={`rotate(${degrees}, 394, 387)`}>

        <path className={classNames.inner.join(' ')} d="M401.19,201.6a179,179,0,0,1,22.25,2L399.1,352.72a36.14,36.14,0,0,0-3.73-.35c-1.43,0-2.61.22-4,.35L368.67,203.33A190.88,190.88,0,0,1,401.19,201.6Z" />
        <path className={classNames.outer.join(' ')} d="M350.11,81.6l15.58,102a210.27,210.27,0,0,1,61,.36L443.36,82.15a314.9,314.9,0,0,0-38.21-3.58,307,307,0,0,0-55.09,3Z" />
        <path className={classNames.double.join(' ')} d="M405.29,75.56a320.25,320.25,0,0,1,38.6,3.61l2.55-15.57a331.26,331.26,0,0,0-41.5-4.08,320.1,320.1,0,0,0-57.67,3.54l2.38,15.59A317.11,317.11,0,0,1,405.29,75.56Z" />
        <path className={classNames.triple.join(' ')} d="M365.9,186.8l2.28,13.84a192,192,0,0,1,33-2.13,202.58,202.58,0,0,1,22.67,1.82L426,186.46a207.54,207.54,0,0,0-24.51-2,200.83,200.83,0,0,0-35.52,2.31Z" />
        <text className={classNames.score.join(' ')} textAnchor="middle" transform="matrix(1 0 0 1 398 40) ">{number}</text>
      </g>
  );
}

Slice.propTypes = {
  dark: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  degrees: PropTypes.number.isRequired
};

export default Slice;