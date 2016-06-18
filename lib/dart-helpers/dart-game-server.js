'use strict';
var redux = require('redux'),
    rootReducer = require('./dart-game-server/reducers'),
    actions = require('./dart-game-server/actions');


module.exports = class DartGameServer {
  /**
   * Boilerplate config setup
   *
   * @param config {{variation: string, modifiers: object, players: Array, playerOrder: Array}}
   */
  constructor(config) {
    this.store = redux.createStore(rootReducer.bind(this));


    //this.store.subscribe(() =>
    //  console.log(this.store.getState())
    //);

    this.store.dispatch(actions.init(config));
  }

  /**
   * Gets the a default display name for this game type.
   *
   * @returns {string}
   */
  getDisplayName() {
    return this.constructor.name;
  }


  /**
   * The main entry point into the game. This needs to return false if it fails
   * or an object with some meta data about the throw (player id, round, points,
   * meta)
   *
   * @param {{type: string, number: int}} throwData
   * @returns {{playerId: string, round: int, leg: int, points: int, meta: object}|boolean}
   */
  processThrow(throwData) {
    return false;
  }

  undoLastThrow() {
    return false;
  }

  getState() {
    return this.store.getState();
  }
};


