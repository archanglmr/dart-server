'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

/**
 * @todo: When getting a bull multiplier it should show on the throw widget
 */
module.exports = class DartGameServer_TugOWar extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var state = this.getState(),
        name = state.config.variation || 'Tug-O-War (Beta)',
        modifiers = this.formatModifiers(state.game.modifiers);

    return name + (modifiers ? ` ${modifiers}` : '');
  }

  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param handicap {number}
   * @param multiplier {number}
   * @param last_round {boolean}
   * @returns {{multiplier: number, value: number}}
   */
  calculateThrowDataValue(throwData, handicap, multiplier, last_round) {
    var value = throwData.number,
        increase_multiplier = 0;

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
        if (this.isBullMultiplier() && 25 === value) {
          increase_multiplier = 2;
        } else {
          value *= 2;
        }
        break;

      case ThrowTypes.MISS:
      case ThrowTypes.SINGLE_INNER:
      case ThrowTypes.SINGLE_OUTER:
          if (this.isBullMultiplier() && 25 === value) {
            increase_multiplier = 1;
          }
        break;
    }

    if (increase_multiplier) {
      if (!last_round || multiplier > 1) {
        multiplier += increase_multiplier;
      }

      if (last_round) {
        value = Math.ceil(handicap * multiplier * value);
      } else {
        value = 0;
      }
    } else {
      value = Math.ceil(handicap * multiplier * value);
      multiplier = 1;
    }
    return {multiplier, value};
  }

  /**
   * Check to see if the passed handicap is within the valid range.
   *
   * @param {number} handicap
   * @returns {boolean}
   */
  isValidHandicap(handicap) {
    return handicap >= .1 && handicap <= 10;
  }

  /**
   * Checks to see if the bull multiplier modifier is on.
   *
   * @returns {boolean}
   */
  isBullMultiplier() {
    if (undefined === this.bull_multiplier) {
      let config = this.getState().config;
      this.bull_multiplier = (config.modifiers && config.modifiers.bull_multiplier);
    }
    return this.bull_multiplier;
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
        rounds = Object.assign({}, state.rounds),
        handicaps = config.extras ? config.extras.handicap : false;

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('limit')) {
        rounds.limit = config.modifiers.limit;
      }
      if (config.modifiers.hasOwnProperty('bull_multiplier') && config.modifiers.bull_multiplier) {
        game.modifiers.push('Bull Multiplier');
      }
    }


    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i],
          handicap = (handicaps && this.isValidHandicap(handicaps[id])) ? handicaps[id] : 1;

      game.players[id] = {
        id,
        score: 301,
        ppd: 0,
        history: [0],
        throwHistory: [],
        handicap,
        multiplier: 1,
        disabled: false
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
          throwStats = null,
          notificationQueue = [{type: 'throw', data: throwData}],
          finished = state.finished,
          winner = state.winner;

      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      // set this a little early because it will determine the final round score
      // if there was a multiplier.
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      // we need to know if the round is over before we calculate the throwStats
      throwStats = this.calculateThrowDataValue(throwData, game.players[players.current].handicap, game.players[players.current].multiplier, game.roundOver);
      game.tempScore += throwStats.value;

      // set the temp score as in the player score history
      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      game.players[players.current].multiplier = throwStats.multiplier;
      let score = game.players[players.current].score += throwStats.value,
          throws = game.players[players.current].throwHistory.length;

      game.players[players.current].ppd = throws ? (score / throws) : 0;

      let allDisabled = true;
      for (let i = 0, c = players.order.length; i < c; i += 1) {
        let id = players.order[i];
        if (id !== players.current && !game.players[id].disabled) {
          game.players[id].score -= throwStats.value;
          if (game.players[id].score <= 0) {
            game.players[id].disabled = true;
          } else {
            allDisabled = false;
          }
        }
      }

      if (allDisabled) {
        // you win
        finished = true;
        winner = players.current;
        notificationQueue.push(this.buildWinnerNotification(winner));
      }

      // Process advance round
      if (game.roundOver) {
        notificationQueue = notificationQueue.concat(
            (
              this.checkForHatTrickNotifications(game.currentThrows) ||
              this.checkForTonNotifications(game.tempScore) ||
              []
            ),
            [{type: 'remove_darts'}]
        );
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: !winner, // by not locking we can undo
        finished,
        winner,
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

        if (game.players[players.current].disabled) {
          return this.actionAdvanceGame(Object.assign({}, state, {players, rounds})
          );
        }

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
        if (game.players[players.current].disabled) {
          return this.actionAdvanceGame(Object.assign({}, state, {players})
          );
        }
      }

      if (playerChanged) {
        game.players[players.current].history[rounds.current] = 0;
        game.players[players.current].multiplier = 1;
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
