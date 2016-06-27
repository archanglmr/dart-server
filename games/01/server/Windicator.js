'use strict';
var DartHelpersTest = require('../../../lib/dart-helpers/test');


module.exports = class Windicator {
  constructor(calculateThrowDataValue) {

    /* building a cache of values we can use to calculate the windicator */
    this.throwValues = {};
    this.throwKeys = [];
    this.highestValue = 0;

    let throws = DartHelpersTest.listAllThrows();

    for (let i = 0, c = throws.length; i < c; i += 1) {
      let throwData = throws[i],
          value = calculateThrowDataValue(throwData);

      if (!this.throwValues[value]) {
        this.throwValues[value] = [];
        this.throwKeys.push(value);
      }
      this.throwValues[value].push(throwData);

    }
    this.throwKeys = this.throwKeys.sort((a, b) => b - a);

    this.highestValue = this.throwKeys[0];
  }

  /**
   * Takes in the goal number and and rounds remaining then returns the throws
   * needed to get to 0 (if possible)
   *
   * @param goal {number}
   * @param throwsRemaining {number}
   * @returns {Array}
   */
  calculate(goal, throwsRemaining) {
    // make sure it's even possible to find a win
    if ((this.highestValue * throwsRemaining) >= goal) {
      let values = [],
          remaining = goal;

      for (let i = 0; i < throwsRemaining; i += 1) {
        // loop through the rounds
        for (let j = 0, c = this.throwKeys.length; j < c; j += 1) {
          let key = this.throwKeys[j];
          if (key > 0) {
            if (key === remaining) {
              values.push(this.throwValues[key].slice(0));
              return values;
            } else if (key < remaining) {
              values.push(this.throwValues[key].slice(0));
              remaining -= key;
              break;
            }
          }
        }
      }
    }
    return [];
  }
};