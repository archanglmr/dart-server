'use strict';
var DartHelpersTest = require('../dart-helpers/test'),
    dartServerPlugin = require('../dart-helpers/dart-game-server/actions').dartServerPlugin,
    ThrowTypes = require('../throw-types'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request-promise');


module.exports = class WindicatorPlugin {
  constructor(windicator, calculateScore) {
    this.calculateScore = calculateScore;
    this.windicator = windicator;
    this.values = [];
  }

  /**
   * This is where the work happens in the plugin.
   *
   * @param store
   * @param next
   */
  run(store, next) {
    var state = store.getState();
    // setTimeout() is async. Replace with HTTP request or something. Note I
    // bound to "this" for the callback in this example (just watch your
    // bindings). ES2015 syntax I think is automatically bound to "this".
    //setTimeout(function() {
    //  // do your work here
    //  this.calculate(
    //      state.game.players[state.game.currentPlayer].score,
    //      state.game.rounds.throws - state.game.currentThrow,
    //      state.game.players[state.game.currentPlayer].throwHistory
    //  );

    //  // be sure to dispatch this action with your custom reducer and have it
    //  // bound to "this" if you want to access your own properties
    //  store.dispatch(dartServerPlugin(this.reducer.bind(this)));
    //  next();
    //}.bind(this), 0);
    this.windicator.calculate(
          //state.game.players[state.game.currentPlayer].score,
          this.calculateScore(state),
          state.rounds.throws - state.game.currentThrow,
          state.game.players[state.players.current].throwHistory
        ).then((value) => {
            this.values = value;
            store.dispatch(dartServerPlugin(this.reducer.bind(this)));
            next();
    });

  }


  /**
   * Takes the full state and returns a new updated version of the state without
   * operating on the orignail (standard Redux).
   *
   * @param state
   * @returns {*}
   */
  reducer(state) {
    // NO ASYNC STUFF HERE
    return Object.assign({}, state, {
      game: Object.assign({}, state.game, {widgetWindicator: this.values}),
      widgetDartboard: this.toWidgetDartboard()
    });
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
