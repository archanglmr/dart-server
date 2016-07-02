'use strict';
var DartHelpersTest = require('../../../lib/dart-helpers/test'),
    ThrowTypes = require('../../../lib/throw-types'),
    _ = require('underscore');


module.exports = class Windicator {
  constructor(calculateThrowDataValue) {

    /* building a cache of values we can use to calculate the windicator */
    this.allPossibleValues = this.generate();
    this.throwValues = {};
    this.throwKeys = [];
    this.highestValue = 0;

    this.values = [];

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
   * @returns {Array{Array{}}
   */
  calculate(goal, throwsRemaining) {
    // make sure it's even possible to find a win
    if ((this.highestValue * throwsRemaining) >= goal) {
      let remaining = goal;
      let combinations = this.combsWithRepOuter(throwsRemaining, this.allPossibleValues);
      this.values = _.filter(this.reWeigh(this.findCombinationsForTarget(remaining, combinations, [])), (elem) => elem.type != ThrowTypes.MISS);
      return this.values;
    }
    this.values = [];
    return this.values;
  }

  getWeights(val) {
    let singleChooser = () => val.number == 21 ? .4 : .9;
    let doubleChooser = () => val.number == 21 ? .3 : .4;

    let weights = {};
    weights[ThrowTypes.SINGLE_OUTER] = singleChooser;
    weights[ThrowTypes.SINGLE_INNER] = singleChooser;
    weights[ThrowTypes.DOUBLE] = doubleChooser;
    weights[ThrowTypes.TRIPLE] = () => .5;
    weights[ThrowTypes.MISS] = () => 1;
    return weights[val.type]();
  }

  reWeigh(choices) {
    let weigher = (val) => {
      val.weight = this.getWeights(val);
      return val;
    }
    let choicesWithWeights = _.map(choices, (throws) => _.map(throws, weigher));
    return _.sortBy(choicesWithWeights, (throws) => _.reduce(throws, (acc, val) => acc * val.weight, 1)).reverse();
  }
  /**
   * This is the algorithm to select from the available throw choices the ones that will get us to our desire target
   *
   * @param target {number}
   * @param choices {Array{Array{number}}}
   * @param acc {Array{Array{number}}}
   * @returns {Array{Array{number}}}
   */
  // Take a target, and a list of lists of available choices, The acc(umulator) will collect our results and return it as a list of lists of choices
  findCombinationsForTarget(target /* integer */, choices /* [[integers..]]*/, acc /* [[integers..]]*/) {
    if (choices.length == 0) {
      return acc; //Tail recursive return, return whatver has been accumulated
    }
    //Split the list into first element and rest of list
    var first = _.first(choices);
    var rest = _.rest(choices, 1);
    // Sum the first element and compare it to target
    var fun = (val) => target == _.reduce(val, (acc,r) => acc + r.value, 0);
    var res = fun(first) ? [first] : [];
    // Accumulate it into our list of results
    var res1 = res.concat(acc);
    // Tail call for optimization
    return this.findCombinationsForTarget(target, rest, res1);
  }

  /**
   * Algorithm for taking a list of available choices and returning all combinations (with repetitions) of the length we want
   *
   * @param count {number}
   * @param listOfAllChoices {Array{number}}
   * @returns {Array{Array{number}}}
   */
  // Find all combinations of listOfAllChoices with length of count. Returns a list of lists of choices
  combsWithRepOuter(count /* integer */, listOfAllChoices /* list of choices */) {
    let combinations = this.combsWithRep(count, listOfAllChoices);
    let resortedCombinations = _.map(combinations, (choices) => {
        let ord = _.sortBy(choices, (choice) => this.throwTypeOrdering(choice.type));
        //return _.filter(ord, (elem) => elem.type != ThrowTypes.MISS);
        return ord;
    });
    return resortedCombinations;
  }
  /**
   * Algorithm for taking a list of available choices and returning all combinations (with repetitions) of the length we want
   *
   * @param count {number}
   * @param listOfAllChoices {Array{number}}
   * @returns {Array{Array{number}}}
   */
  // Find all combinations of listOfAllChoices with length of count. Returns a list of lists of choices
  combsWithRep(count /* integer */, listOfAllChoices /* list of choices */) {
    if (count <= 0) {
      return [[]]; // Must return multidimensional empty of recursion fails to accumulate the outer value
    }
    if (listOfAllChoices.length == 0) {
      return [];
    }
    // Split the list into the first element and the rest of the list
    var first = _.first(listOfAllChoices);
    var rest = _.rest(listOfAllChoices, 1);
    // Recurse finding all smaller combinations available out of our total list of choices. Still have whole pool of choices available (allows for repetition)
    var leftIteration = this.combsWithRep((count - 1), listOfAllChoices);
    var newList = [];
    // For each sub combination (recursive), prepend the current scopes first element. Accumulate all results
    for (var i = 0; i < leftIteration.length; i++) {
        var elem = leftIteration[i];
        var innerList = [first].concat(elem);
        newList.push(innerList);
    }
  
    // Recurse finding all combinations using the remaining numbers in the list, but using the original count.
    var allTheRest = this.combsWithRep(count, rest);
    return newList.concat(allTheRest);
  
  }

  throwTypeOrdering(throwType) {
    let order = {};
    order[ThrowTypes.MISS] = 5;
    order[ThrowTypes.TRIPLE] = 4;
    order[ThrowTypes.DOUBLE] = 3;
    order[ThrowTypes.SINGLE_INNER] = 2;
    order[ThrowTypes.SINGLE_OUTER] = 1;
    return order[throwType];
  }

  generate() {
    var list = [];
    list.push({type: ThrowTypes.MISS, number: 0, value: 0});
    for (let i = 1, c = 20; i <= c; i += 1) {
      list.push({type: ThrowTypes.SINGLE_OUTER, number: i, value: i});
      list.push({type: ThrowTypes.DOUBLE, number: i, value: i * 2});
      list.push({type: ThrowTypes.TRIPLE, number: i, value: i * 3});
    }
    list.push({type: ThrowTypes.SINGLE_OUTER, number: 21, value: 25});
    list.push({type: ThrowTypes.DOUBLE, number: 21, value: 50});
  
    return list;
  }

  /**
   * If there is value set this will return an object that is compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @returns {{}}
   */
  toWidgetDartboard() {
    var dartboard = {
      visible: false,
      hide: {},
      blink: {},
      highlight: {}
    };

    if (this.values.length) {
      dartboard.visible = true;
      let val = this.values[0];

      for (let i = 0, c = val.length; i < c; i += 1) {
        let currentThrow = val[i];
        if (!dartboard.highlight[currentThrow.number]) {
          dartboard.highlight[currentThrow.number] = [];
        }
        dartboard.highlight[currentThrow.number].push(currentThrow);

        // special case for singles
        if (currentThrow.type === ThrowTypes.SINGLE_OUTER) {
          dartboard.highlight[currentThrow.number].push({number: currentThrow.number, type: ThrowTypes.SINGLE_INNER});
        } else if (currentThrow.type === ThrowTypes.SINGLE_INNER) {
          dartboard.highlight[currentThrow.number].push({number: currentThrow.number, type: ThrowTypes.SINGLE_OUTER});
        }
      }
    }
    return dartboard;
  }
};
