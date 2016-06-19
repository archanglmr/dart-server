'use strict';
var ThrowTypes = require('../throw-types');


class Test {
  /**
   * Generates a random throw. Good for testing or developing the game without
   * real throw input.
   *
   * @returns {{type: string, number: number}}
   */
  static generateThrowData() {
    var throwData = {
          type: '',
          number: Math.floor(Math.random() * 22)
        },
        valid = [],
        rand = 0,
        key = 0;

    switch(throwData.number) {
      case 21:
        valid = [ThrowTypes.SINGLE_OUTER, ThrowTypes.DOUBLE];
        throwData.type = valid[Math.floor(Math.random() * valid.length)];
        break;
      case 0:
        throwData.type = ThrowTypes.MISS;
        break;
      default:
        valid = [ThrowTypes.SINGLE_INNER, ThrowTypes.SINGLE_OUTER, ThrowTypes.DOUBLE, ThrowTypes.TRIPLE];
        throwData.type = valid[Math.floor(Math.random() * valid.length)];
        break;
    }

    return throwData;
  }
}

module.exports = Test;