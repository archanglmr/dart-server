'use strict';
var DartHelpersTest = require('../../../lib/dart-helpers/test'),
    dartServerPlugin = require('../../../lib/dart-helpers/dart-game-server/actions').dartServerPlugin,
    ThrowTypes = require('../../../lib/throw-types'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request-promise');


module.exports = class WindicatorOpponentPlugin {
  constructor(windicator) {
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
    let opponents = _.filter(_.map(state.game.players, (p, k) => {
        if (k != state.game.currentPlayer) {
            return this.windicator.calculate(
                p.score - state.game.players[state.game.currentPlayer].score,
                state.game.rounds.throws - state.game.currentThrow,
                state.game.players[state.game.currentPlayer].throwHistory
            ).then((v) => { return {player: p, value: v}; });
        } else {
            return null;
        }
    }), (v) => v != null);
    Promise.all(opponents).then((values) => {
        console.log(values);
        this.values = values;
            store.dispatch(dartServerPlugin(this.reducer.bind(this)));
            next();
    });
//    this.windicator.calculate(
//          //state.game.players[state.game.currentPlayer].score,
//          this.calculateScore(state),
//          state.game.rounds.throws - state.game.currentThrow,
//          state.game.players[state.game.currentPlayer].throwHistory
//        ).then((value) => {
//            this.values = value;
//            store.dispatch(dartServerPlugin(this.reducer.bind(this)));
//            next();
//    });

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
      game: Object.assign({}, state.game, {opponentWindicators: this.values})
    });
  }

};
