'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    WindicatorOpponentPlugin = require('../../../lib/windicator/WindicatorOpponentPlugin'),
    WindicatorPlugin = require('../../../lib/windicator/WindicatorPlugin'),
    Windicator = require('../../../lib/windicator/Windicator');

module.exports = class DartGameServer_Gotcha extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var state = this.getState(),
        name = state.config.variation || super.getDisplayName(),
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
   * Checks all the players and resets their score to 0 if they have the same
   * score as the current player. Shouldn't really be called "list" since no two
   * scores can match.
   *
   * @param players {Array}
   * @param currentPlayerId {number}
   * @returns {Array}
   */
   listPlayersToBomb(players, currentPlayerId) {
    var bombScore = players[currentPlayerId].score,
        bombedPlayers = [];

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        if (players[id].id !== currentPlayerId && players[id].score === bombScore) {
          //players[id].score = 0;
          bombedPlayers.push(id);
        }
      }
    }
    return bombedPlayers;
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
    var config = Object.assign({}, state.config),
    // cloning the part we need because we're going to overwrite stuff
        game = {
          tempScore: 0,
          roundBeginningScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          widgetWindicator: [],
          opponentWindicators: [],
          modifiers: []
        },
        rounds = Object.assign({}, state.rounds);

    this.registerPlugin(new WindicatorPlugin(new Windicator(this.calculateThrowDataValue.bind(this), config.extras), (state) => 301 - state.game.players[state.players.current].score));
    this.registerPlugin(new WindicatorOpponentPlugin(new Windicator(this.calculateThrowDataValue.bind(this), config.extras)));

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('limit')) {
        rounds.limit = config.modifiers.limit;
      }
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
          notificationQueue = [{type: 'throw', data: throwData}],
          finished = state.finished,
          winner = state.winner;

      game.roundOver = false;
      game.tempScore += this.calculateThrowDataValue(throwData);
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      // set the temp score as in the player score history
      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      let score = game.players[players.current].score = (game.roundBeginningScore + game.tempScore),
          throws = game.players[players.current].throwHistory.length;

      game.players[players.current].ppd = throws ? (score / throws) : 0;

      if (301 === score) {
        finished = true;
        winner = players.current;
        notificationQueue.push(this.buildWinnerNotification(winner));
      } else {
        // Process BUST or advance round
        if (score > 301) {
          // bust
          game.roundOver = true;
          notificationQueue.push({type: 'bust'});
        } else if (score > 0) {
          // check for bombs (must have some score)
          let bombedPlayers = this.listPlayersToBomb(game.players, players.current);
          for (let i = 0, c = bombedPlayers.length; i < c; i += 1) {
            let id = bombedPlayers[i],
                oldScore = game.players[id].score;
            game.players[id].score = 0;
            notificationQueue.push({
              type: 'bomb',
              data: {
                id,
                name: players.data[id].displayName,
                score: oldScore
              }
            });
          }
        }

        // game.roundOver flag may already be set if the player busted
        if (!game.roundOver && rounds.currentThrow >= rounds.throws) {
          // round over
          game.roundOver = true;
          notificationQueue = notificationQueue.concat(
              this.checkForHatTrickNotifications(game.currentThrows) ||
              this.checkForTonNotifications(game.tempScore) ||
              []
          );
        }

        if (game.roundOver && !winner) {
          notificationQueue.push({type: 'remove_darts'});
        }
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


      // Process BUST
      if (game.players[players.current].score > 301) {
        // advance from a bust
        let score = game.players[players.current].score = game.roundBeginningScore,
            throws = game.players[players.current].throwHistory.length;
        game.players[players.current].history[rounds.current] = 0;

        game.players[players.current].ppd = throws ? ((301 - score) / throws) : 0;

        rounds.currentThrow = 0;
        game.currentThrows = [];
        game.tempScore = 0;
        players.currentOffset += 1;
        playerChanged = true;
      } else if (rounds.currentThrow >= rounds.throws) {
        // advance the game normally
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
        game.roundBeginningScore = game.players[players.current].score;
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
