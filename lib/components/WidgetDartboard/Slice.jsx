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
        <path className={classNames.inner.join(' ')} d="M401 201.327c7.521 0 15 0.4 22.3 1.319l-19.938 152.518c-0.796-0.056-1.596-0.095-2.406-0.095 c-1.435 0-2.846 0.1-4.235 0.274l-28.171-151.236C379.217 202.3 390 201.3 401 201.327z" />
        <path className={classNames.outer.join(' ')} d="M346.042 83.046l18.884 101.4 c11.825-2.069 23.87-3.111 36.074-3.111c8.396 0 16.7 0.5 24.9 1.484l13.367-102.25c-12.629-1.547-25.408-2.331-38.308-2.331 C382.4 78.2 364.1 79.8 346 83.046z" />
        <path className={classNames.double.join(' ')} d="M401 75.214c13.03 0 25.9 0.8 38.7 2.355l2.045-15.642 c-14.604-1.835-28.238-2.729-41.611-2.729c-18.558 0-37.395 1.772-57.521 5.416l2.884 15.5 C363.681 76.9 382.2 75.2 401 75.214z" />
        <path className={classNames.triple.join(' ')} d="M365.476 187.372l2.567 13.784c10.804-1.88 21.808-2.83 32.957-2.83 c7.652 0 15.2 0.5 22.7 1.344l1.816-13.901c-8.097-0.964-16.285-1.459-24.551-1.459 C388.981 184.3 377.1 185.3 365.5 187.372z" />
        <text className={classNames.score.join(' ')} transform="matrix(1 0 0 1 375.4799 40)">{number}</text>
      </g>
  );
}

Slice.propTypes = {
  dark: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  degrees: PropTypes.number.isRequired
};

export default Slice;