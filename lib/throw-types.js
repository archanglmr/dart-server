'use strict';

/**
 * ThrowType constants
 */
const ThrowTypes = {
  SINGLE_INNER: 'SINGLE_INNER',
  TRIPLE: 'TRIPLE',
  SINGLE_OUTER: 'SINGLE_OUTER',
  DOUBLE: 'DOUBLE',
  MISS: 'MISS',
  ordering: (throwType) => {
      let ord = -1;
      switch (throwType) {
        case ThrowTypes.MISS:
          ord = 5;
          break;
        case ThrowTypes.TRIPLE:
          ord = 4;
          break;
        case ThrowTypes.DOUBLE:
          ord = 3;
          break;
        case ThrowTypes.SINGLE_INNER:
          ord = 2;
          break;
        case ThrowTypes.SINGLE_OUTER:
          ord = 1;
          break;
      }
      return ord;
  }
};

module.exports = ThrowTypes;
