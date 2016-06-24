'use strict';
var ThrowTypes = require('../throw-types');


class Test {
  /**
   * Takes in some throwData and returns true if it's a valid throw or false if
   * it's not.
   *
   * @param throwData {{type: string, number: number}}
   * @returns {boolean}
   */
  static isValidThrow(throwData) {
    if ('object' === typeof throwData) {
      if (throwData.hasOwnProperty('type') && throwData.hasOwnProperty('number')) {
        let number = parseInt(throwData.number, 10);
        if (number >= 0 && number <= 21) {
          if (
              throwData.type === ThrowTypes.MISS ||
              throwData.type === ThrowTypes.SINGLE_INNER ||
              throwData.type === ThrowTypes.TRIPLE ||
              throwData.type === ThrowTypes.SINGLE_OUTER ||
              throwData.type === ThrowTypes.DOUBLE
          ) {
            switch(number) {
              case 21:
                return (
                    throwData.type === ThrowTypes.DOUBLE ||
                    throwData.type === ThrowTypes.SINGLE_OUTER
                );
              case 0:
                return (throwData.type === ThrowTypes.MISS);
              default:
                return true;
            }
          }
        }
      }
    }
    return false;
  }

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
   * Formats a throwData object into a small string
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