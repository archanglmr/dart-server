'use strict';


module.exports = class DartGameServer {
  /**
   *
   * @param config
   */
  constructor(config) {
    this.state = {
      // the config for this game
      config : {
        variation: '',
        modifiers: {}
      },

      // store the state and rules of the round
      round: {
        throws: 3,

        current: 1,
        limit: 25,

        timeLimit: 0
      },

      // for legged games store the current leg and the limit
      //leg: {
      //  current: 1,
      //  limit: 1
      //},

      /**
       * Player info
       */
      // id of current player
      currentPlayer: 0,

      // list by id
      playerOrder: [],

      // id: {id, name, color, "score"}
      players: {},


      /**
       * Throw info
       */
      // [{id, }, ...]
      throws: []
    };
  }


  /**
   * The main entry point into the game. This needs to return false if it fails
   * or an object with some meta data about the throw (player id, round, points,
   * meta)
   *
   * @param {{type: string, number: int}} throwData
   * @returns {{playerId: string, round: int, leg: int, points: int, meta: object}|boolean}
   */
  acceptThrow(throwData) {
    return false;
  }

  undoLastThrow() {
    return false;
  }

  getState() {
    return this.state;
  }
};