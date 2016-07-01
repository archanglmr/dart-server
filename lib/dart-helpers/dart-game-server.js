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
    this.history = [];
    this.current = null;


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
   * Gets the name of the clients display key. It's this part of the iframe url.
   *
   * @returns {string}
   */
  getClientDisplayKey() {
    if (!this._displayKey) {
      this._displayKey = this.constructor.name.match(/DartGameServer_(.+)$/)[1].toLowerCase();
    }
    return this._displayKey;
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
    this.current = JSON.parse(JSON.stringify(this.store.getState()));
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

    if (this.current) {
      this.history.push(this.current);
    }
    this.current = JSON.parse(JSON.stringify(this.store.getState()));
  }

  /**
   * This action is needed to advance the game. This gives the UI a chance to
   * update and for a player to see what they got on their last round.
   */
  advanceGame() {
    this.store.dispatch(actions.advanceGame());
  }

  undoLastThrow() {
    if (this.history.length && !this.store.getState().locked) {
      this.current = this.history.pop();
      this.store.dispatch(actions.undoThrow(this.current));
      return true;
    }
    return false;
  }

  getState() {
    return this.store.getState();
  }

  historyLength() {
    return this.history.length;
  }
};


