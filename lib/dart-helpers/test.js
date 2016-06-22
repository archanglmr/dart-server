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

  /**
   * Formats a throwData objet into a small string
   *
   * @param throwData {{type: string, number: number}}
   * @returns {string}
   */
  static formatThrowData(throwData) {
    var formatted = '';

    if (0 === throwData.number) {
      formatted = 'MISS';
    } else {
      switch(throwData.type) {
        case ThrowTypes.DOUBLE:
          formatted = 'D';
          break;

        case ThrowTypes.TRIPLE:
          formatted = 'T';
          break;

        default:
          formatted = 'S';
          break;
      }

      formatted += '-' + ((21 === throwData.number) ? 'BULL' : throwData.number);
    }
    return formatted;
  }

  static throwsWidget(state) {
    var throws = [],
        throwLimit = state.rounds.throws,
        widgetLimit = state.widgetThrows.length;

    for (let i = 0; i < throwLimit; i += 1) {
      if (i < widgetLimit) {
        throws.push(Test.formatThrowData(state.widgetThrows[i]));
      } else {
        throws.push('----');
      }
    }
    return throws.join('  ');
  }
}

module.exports = Test;