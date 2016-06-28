'use strict';

import React, {PropTypes} from 'react';


function Slice({dark, number, degrees}) {
  var className = [
    'sector',
    ('sector_' + number),
    (dark ? 'dark' : 'light')
  ];


  return (
      <g className={className.join(' ')} transform={`rotate(${degrees}, 394, 387)`}>
        <path className="single little small" d="M401 201.327c7.521 0 15 0.4 22.3 1.319l-19.938 152.518c-0.796-0.056-1.596-0.095-2.406-0.095 c-1.435 0-2.846 0.1-4.235 0.274l-28.171-151.236C379.217 202.3 390 201.3 401 201.327z" />
        <path className="single fat" d="M346.042 83.046l18.884 101.4 c11.825-2.069 23.87-3.111 36.074-3.111c8.396 0 16.7 0.5 24.9 1.484l13.367-102.25c-12.629-1.547-25.408-2.331-38.308-2.331 C382.4 78.2 364.1 79.8 346 83.046z" />
        <path className="double" d="M401 75.214c13.03 0 25.9 0.8 38.7 2.355l2.045-15.642 c-14.604-1.835-28.238-2.729-41.611-2.729c-18.558 0-37.395 1.772-57.521 5.416l2.884 15.5 C363.681 76.9 382.2 75.2 401 75.214z" />
        <path className="triple" d="M365.476 187.372l2.567 13.784c10.804-1.88 21.808-2.83 32.957-2.83 c7.652 0 15.2 0.5 22.7 1.344l1.816-13.901c-8.097-0.964-16.285-1.459-24.551-1.459 C388.981 184.3 377.1 185.3 365.5 187.372z" />
        <text className="score" transform="matrix(1 0 0 1 375.4799 40)">{number}</text>
      </g>
  );
}

Slice.propTypes = {
  dark: PropTypes.bool.isRequired,
  number: PropTypes.number.isRequired,
  degrees: PropTypes.number.isRequired
};

export default Slice;