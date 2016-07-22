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
        //console.log(values);
        this.values = values;
        store.dispatch(dartServerPlugin(this.reducer.bind(this)));
        next();
    });
  }


  /**
   * Takes the full state and returns a new updated version of the state without
   * operating on the original (standard Redux).
   *
   * @param state
   * @returns {*}
   */
  reducer(state) {
    var players = Object.assign({}, state.game.players),
        values = {};

    // convert to an object of values indexed by player id
    for (let i = 0, c = this.values.length; i < c; i += 1) {
      let opponent = this.values[i];
      values[opponent.player.id] = opponent.value;
    }

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        Object.assign(players[id], {bombWindicator: values[id] || []});
      }
    }

    // NO ASYNC STUFF HERE
    return Object.assign({}, state, {game: Object.assign({}, state.game, {players})});
  }

};