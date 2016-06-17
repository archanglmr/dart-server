'use strict';


module.exports = class DartGameServer {
  constructor() {
    this.state = {
      // store the state and rules of teh round
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



  acceptThrow(info) {
    return false;
  }

  undoLastThrow() {
    return false;
  }

  getState() {
    return state;
  }
};