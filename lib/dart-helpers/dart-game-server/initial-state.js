'use strict';

module.exports = {
  // the config for this game
  config : {
    variation: '',
    modifiers: {}
  },

  // store the state and rules of the round
  rounds: {
    throws: 3,

    current: 0, // @todo: POPULATE!!!
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
  players: {
    // id of current player
    current: 0, // @todo: POPULATE!!!

    // list by id
    order: [],

    // id: {id, name, color, "score"}
    data: {}
  },


  /**
   * Throw info
   */
  // [{id, }, ...]
  throws: [], // @todo: POPULATE!!!

  /**
   * Any data about the current games state.
   */
  game: {} // @todo: POPULATE!!!
};