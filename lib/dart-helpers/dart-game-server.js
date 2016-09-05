'use strict';
var redux = require('redux'),
    rootReducer = require('./dart-game-server/reducers'),
    actions = require('./dart-game-server/actions'),
    mware = require('mware'),

    FilterTypes = require('./state').FilterTypes,
    ThrowTypes = require('./../throw-types');


module.exports = class DartGameServer {
  /**
   * Boilerplate config setup
   *
   * @param config {{variation: string, modifiers: object, players: Array, playerOrder: Array, seed: integer}}
   */
  constructor(config) {
    this.store = redux.createStore(rootReducer.bind(this));
    this.history = [];
    this.current = null;
    this.plugins = mware();

    if (!config.seed) {
      config.seed = Math.round((new Date()).getTime());
    }

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
    if (!this._displayName) {
      this._displayName = this.constructor.name.match(/DartGameServer_(.+)$/)[1];
    }
    return this._displayName;
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
   * List the allowed value for modifiers.filter. Combine with
   * checkThrowFilter(throwData) to see if a throw is valid. If FALSE is
   * returned there is no supported filter.
   *
   * @returns {string[]}
   */
  listFiltersAllowed() {
    return false;
  }

  /**
   * Gets the currently set Filter.
   *
   * @returns {boolean|*}
   */
  getFilter() {
    if (!this._filter) {
      this._filter = false;
      let modifiers = this.getState().config.modifiers;
      if (modifiers && modifiers.hasOwnProperty('filter')) {
        this._filter = modifiers.filter;
      }
    }
    return this._filter;
  }

  /**
   * Checks if the throwData meets the current filter. If you want to handle
   * bull specially do so outside of this check.
   *
   * @param {{type: string, number: int}} throwData
   * @returns {bool}
   */
  isFilteredThrow(throwData) {
    var filter = this.getFilter();
    if (filter) {
      switch (filter) {
        case FilterTypes.SINGLES:
          return (throwData.type === ThrowTypes.SINGLE_INNER || throwData.type === ThrowTypes.SINGLE_OUTER);

        case FilterTypes.DOUBLES:
          return (throwData.type === ThrowTypes.DOUBLE);

        case FilterTypes.TRIPLES:
          return (throwData.type === ThrowTypes.TRIPLE);

        case FilterTypes.MASTERS:
          return (throwData.type === ThrowTypes.DOUBLE || throwData.type === ThrowTypes.TRIPLE);
      }
    }

    return true;
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
   * @param {object} state
   * @param {{type: string, number: int}} throwData
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

  checkForHatTrickNotifications(currentThrows) {
    if (currentThrows.length >= 3) {
      let hatTrick = true,
          threeInTheBlack = true;

      for (let i = 0, c = currentThrows.length; i < c; i += 1) {
        let throwData = currentThrows[i];
        if (21 === throwData.number) {
          if (ThrowTypes.DOUBLE !== throwData.type) {
            threeInTheBlack = false;
          }
        } else {
          hatTrick = false;
          threeInTheBlack = false;
        }
      }

      if (threeInTheBlack) {
        return [{type: 'three_in_black'}];
      } else if (hatTrick) {
        return [{type: 'hat_trick'}];
      }
    }
    return false;
  }

  checkForTonNotifications(score) {
    if (180 === score) {
      // ton 80: 180
      return [{type: 'ton_80'}];
    } else if (score >= 150) {
      // high ton: 150 - 179
      return [{type: 'ton_high'}];
    } else if (score >= 100) {
      // low ton: 100-150
      return [{type: 'ton_low'}];
    }

    return false;
  }

  /**
   * Builds notifications for winner, game_over or draw. If an ID is passed a
   * "winner" notification will be returned. If no ID is passed a "game_over" or
   * "draw" notification will be returend depending of if there is one or more
   * players.
   *
   * @param id
   * @returns {*}
   */
  buildWinnerNotification(id = 0) {
    var players = this.getState().players;
    if (id > 0 && players.data[id]) {
      return {
        type: 'winner',
        data: {id: id, name: players.data[id].displayName}
      };
    }
    return (1 === players.order.length) ?
      {type: 'game_over'} :
      {type: 'draw'};
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

  registerPlugin(plugin) {
    this.plugins(plugin.run.bind(plugin));
  }

  runPlugins(cb) {
    this.plugins.run(this.store, cb);
  }
};


