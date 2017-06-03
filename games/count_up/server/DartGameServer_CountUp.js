'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_CountUp extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var state = this.getState(),
        name = state.config.variation || 'Count-Up',
        modifiers = this.formatModifiers(state.game.modifiers);

    return name + (modifiers ? ` ${modifiers}` : '');
  }

  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @returns {number}
   */
  calculateThrowDataValue(throwData) {
    var value = throwData.number;

    /* accounts for the bull */
    if (21 === value) {
      value = 25;
    }

    switch(throwData.type) {
      case ThrowTypes.TRIPLE:
        if (25 !== value) {
          value *= 3;
        }
        break;
      case ThrowTypes.DOUBLE:
        /*
          if you wanted different rules for double bull this is the place to
          put them
        */
        value *= 2;
        break;

      case ThrowTypes.MISS:
      case ThrowTypes.SINGLE_INNER:
      case ThrowTypes.SINGLE_OUTER:
          if (25 === value && !this.isSplitBull()) {
            value = 50;
          }
        break;
    }
    return value;
  }

  /**
   * Checks to see if this the split bull modifier is on.
   *
   * @returns {boolean}
   */
  isSplitBull() {
    if (undefined === this.split_bull) {
      let config = this.getState().config;
      this.split_bull = (config.modifiers && config.modifiers.split_bull);
    }
    return this.split_bull;
  }





  /*****************************************************************************
   * HOOKS FOR DEFAULT ACTIONS
   ****************************************************************************/

  /**
   * After the init is run this will modify the state per the config and return
   * the new full state.
   *
   * @param {object} state
   * @returns {*}
   */
  actionInit(state) {
    // cloning the part we need because we're going to overwrite stuff
    var config = Object.assign({}, state.config),
        game = {
          tempScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          modifiers: []
        },
        rounds = Object.assign({}, state.rounds, {limit: 8});

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('split_bull') && config.modifiers.split_bull) {
        game.modifiers.push('Split Bull');
      }
    }


    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        ppd: 0,
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, rounds, config});
  }


  /**
   * Start the game (init is handled by the system).
   *
   * @param state {object}
   * @returns {object} game state
   */
  actionStartGame(state) {
    if (!state.started) {
      //init the actual game

      // shallow clone stuff
      let players = Object.assign({}, state.players);

      players.current = players.order[players.currentOffset];

      // rebuild the new state
      return Object.assign({}, state, {
        players,
        started: true,
        locked: false,
        notificationQueue: [{type: 'throw_darts'}]
      });
    }
    return state;
  }


  /**
   * Where the main game logic works. This responds to the PROCESS_DART action.
   *
   * @param state {object}
   * @param throwData
   * @returns {object|boolean}
   */
  actionProcessThrow(state, throwData) {
    if (!state.locked && DartHelpers.State.isPlayable(state)) {
      // we're in a valid round
      // shallow clone stuff
      let game = Object.assign({}, state.game),
          rounds = Object.assign({}, state.rounds),
          players = Object.assign({}, state.players),
          throwScore = this.calculateThrowDataValue(throwData),
          notificationQueue = [{type: 'throw', data: throwData}];

      game.roundOver = false;
      game.tempScore += throwScore;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      // set the temp score as in the player score history
      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      let score = (game.players[players.current].score += throwScore),
          throws = game.players[players.current].throwHistory.length;

      game.players[players.current].ppd = throws ? (score / throws) : 0;

      // Process advance round
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      if (game.roundOver) {
        notificationQueue = notificationQueue.concat((
            this.checkForHatTrickNotifications(game.currentThrows) ||
            this.checkForTonNotifications(game.tempScore) ||
            []),
            [{type: 'remove_darts'}]
        );
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: true,
        notificationQueue
      });
    }
    return state;
  }


  actionAdvanceGame(state) {
    if (state.locked && DartHelpers.State.isPlayable(state)) {
      // we're in a valid round
      // shallow clone stuff
      let game = Object.assign({}, state.game),
          rounds = Object.assign({}, state.rounds),
          players = Object.assign({}, state.players),
          playerChanged = false,
          notificationQueue = state.notificationQueue;

      // advance the game normally
      if (rounds.currentThrow >= rounds.throws) {
        // next player
        rounds.currentThrow = 0;
        game.currentThrows = [];
        game.tempScore = 0;
        players.currentOffset += 1;
        playerChanged = true;
      }


      if (players.currentOffset >= players.order.length) {
        // next round actually
        players.currentOffset = 0;
        players.current = players.order[players.currentOffset];
        rounds.current += 1;

        if (rounds.limit && rounds.current >= rounds.limit) {
          // hit the round limit
          let winner = (players.order.length > 1) ? DartHelpers.State.getPlayerIdWithHighestScore(game.players) : -1;
          return Object.assign({}, state, {
            widgetThrows: game.currentThrows.slice(0),
            finished: true,
            winner,
            notificationQueue: [this.buildWinnerNotification(winner)]
          });
        }
      } else {
        players.current = players.order[players.currentOffset];
      }

      if (playerChanged) {
        game.players[players.current].history[rounds.current] = 0;
        notificationQueue = [{type: 'throw_darts'}];
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: false,
        notificationQueue
      });
    }
    return state;
  }
};
