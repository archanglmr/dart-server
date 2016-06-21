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
   * Responds to START_GAME action. Start the game.
   *
   * @param state {object}
   * @returns {object} game state
   */
  actionStartGame(state) {
    console.log(`Please implement ${this.constructor.name}.actionStartGame()`);
    return state;
  }


  /**
   * Responds to the PROCESS_DART action. Where the main game logic works.
   *
   * @param state {object}
   * @param throwData
   * @returns {object} game state
   */
  actionProcessThrow(state, throwData) {
    console.log(`Please implement ${this.constructor.name}.actionProcessThrow(state, throwData)`);
    return state;
  }

  /**
   * Responds to ADVANCE_GAME action. Advances the game.
   *
   * @param state {object}
   * @returns {object} game state
   */
  actionAdvanceGame(state) {
    console.log(`Please implement ${this.constructor.name}.actionAdvanceGame()`);
    return state;
  }








  /**
   * This method calls action begins the game and dispatches the START_GAME
   * action.
   *
   * Note: Setting up the config for the game is done in the INIT action called
   * by the constructor
   */
  startGame() {
    this.store.dispatch(actions.startGame());
  }

  /**
   * The main entry point into the game. This needs to return false if it fails
   * or an object with some meta data about the throw (player id, round, points,
   * meta)
   *
   * @param {{type: string, number: int}} throwData
   * @returns {{playerId: string, round: int, leg: int, points: int, meta: object}|boolean}
   */
  throwDart(throwData) {
    this.store.dispatch(actions.throwDart(throwData));
    // @todo: implement return value
  }

  /**
   * This action is needed to advance the game. This gives the UI a chance to
   * update and for a player to see what they got on their last round.
   */
  advanceGame() {
    this.store.dispatch(actions.advanceGame());
  }

  undoLastThrow() {
    console.log(`Please implement ${this.constructor.name}.undoLastThrow()`);
    return false;
  }

  getState() {
    return this.store.getState();
  }
};


