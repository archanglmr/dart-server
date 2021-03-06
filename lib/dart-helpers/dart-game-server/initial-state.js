'use strict';

module.exports = {
  /**
   * The name of the game. This should be set on the INIT action.
   *
   * @todo: POPULATE!!!
   */
  gameName: 'Darts',

  /**
   * Started the game successfully in the  START_GAME action
   *
   * @todo: POPULATE!!!
   */
  started: false,

  /**
   * The game will be lock by default but should be unlocked in START_GAME. Use
   * this to lock in PROCESS_THROW and unlocked in ADVANCE_GAME. This will let
   * the server update the UI and ignore the input between throws.
   *
   * @todo: POPULATE!!!
   */
  locked: true,

  /**
   * If the final game state is reached in ADVANCE_GAME then set this to true
   *
   * @todo: POPULATE!!!
   */
  finished: false,

  /**
   * Set this to the id of the winning player. -1 is a draw
   *
   * @param integer
   */
  winner: 0,



  // the config for this game
  config : {
    variation: '',
    modifiers: {}
  },

  // store the state and rules of the round
  rounds: {
    currentThrow: 0, // @todo: POPULATE!!! (0 indexed) current throw
    throws: 3, // throw limit

    current: 0, // @todo: POPULATE!!! (0 indexed) current round
    limit: 25, // round limit

    timeLimit: 0 // time limit (not used)
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

    currentOffset: 0, // @todo: POPULATE!!! (offset relative to players.order array)

    // list by id
    order: [],

    // id: {id, name, color, "score"}
    data: {}
  },


  /**
   * Throw info
   */
  // [{id, }, ...]
  //throws: [], // @todo: POPULATE!!!

  /**
   * This is area to store the custom state related to a game. Some stuff should
   * be stored in specified areas of the global state so the server can help
   * enforce some some of the rule and so various clients have access to data in
   * a standard format (React components, command line tools, LED displays, etc)
   *
   * @todo: POPULATE!!!
   */
  game: {},


  /**
   * Populate this with the throws from the current round. This should be
   * rebuilt on every throw.
   *
   * @todo: POPULATE!!!
   */
  widgetThrows: [],

  /**
   * Populate this with the way you want the darboard to show.
   *
   * @todo: Determine format
   * @todo: POPULATE!!!
   */
  widgetDartboard: {},

  /**
   * A queue of notifications to fire.
   *
   * @todo: POPULATE!!!
   */
  notificationQueue: []
};