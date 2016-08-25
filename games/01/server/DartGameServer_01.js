'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    WindicatorPlugin = require('./../../../lib/windicator/WindicatorPlugin'),
    Windicator = require('./../../../lib/windicator/Windicator');

module.exports = class DartGameServer_01 extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    return this.getState().config.variation || super.getDisplayName();
  }


  ///**
  // * Pretty much just for the command line to see the score after a throw.
  // *
  // * @returns {string}
  // */
  //getScores() {
  //  var state = this.getState(),
  //      player = DartHelpers.State.getPlayer(state, state.players.current),
  //      lines = [],
  //      conditions = [],
  //      score = state.game.players[player.id].score;
  //
  //  if (0 === score) {
  //    conditions.push('WIN');
  //  } if (score < 0) {
  //    conditions.push('BUST');
  //  }
  //  if (state.rounds.limit && ((state.rounds.current + 1) === state.rounds.limit)) {
  //    conditions.push('ROUND LIMIT');
  //  }
  //  lines.push(`Temp Score: ${state.game.tempScore} ${conditions.join(' ')}`);
  //  lines.push('----------------------------------------');
  //  lines.push(
  //      `${player.displayName}: ` +
  //      `throw ${state.game.currentThrow + 1}:${state.rounds.throws} ` +
  //      `round ${state.rounds.current + 1}:${state.rounds.limit}`);
  //  for (let i = 0, c = state.players.order.length; i < c; i += 1) {
  //    let id = state.players.order[i],
  //        player = DartHelpers.State.getPlayer(state, id);
  //
  //    lines.push(
  //        (state.players.current === id ? ' > ' : ' - ') +
  //        `${player.displayName}: ${state.game.players[id].score}`
  //    );
  //  }
  //  //lines.push('----------------------------------------');
  //  lines.push("");
  //  lines.push("");
  //
  //  return lines.join("\n");
  //}


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
        break;
    }
    return value;
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
          roundBeginningScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          widgetWindicator: []
        },
        rounds = Object.assign({}, state.rounds);

    this.registerPlugin(new WindicatorPlugin(new Windicator(this.calculateThrowDataValue, config.extras), (state) => state.game.players[state.players.current].score));

    if (!config.variation) {
      config.variation = 501;
    } else {
      config.variation = parseInt(config.variation, 10);
    }
    if (config.modifiers && config.modifiers.limit) {
      rounds.limit = config.modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: config.variation,
        ppd: 0,
        history: [0],
        throwHistory: []
      };
    }
    game.roundBeginningScore = config.variation;

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
        locked: false
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
      let score = game.players[players.current].score = (game.roundBeginningScore - game.tempScore),
          throws = game.players[players.current].throwHistory.length;

      game.players[players.current].ppd = throws ? ((state.config.variation - score) / throws) : 0;

      if (0 === score) {
        finished = true;
        winner = players.current;
        notificationQueue.push({type: 'winner', data: winner});
      } else {
        // Process BUST or advance round
        if (score < 0) {
          // bust
          game.roundOver = true;
          notificationQueue.push({type: 'bust'});
        } else if (rounds.currentThrow >= rounds.throws) {
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


      // @todo: Turn this into a standard check (this.isLastThrowOfGame(state))
      //if (
      //    rounds.limit &&
      //    rounds.currentThrow >= rounds.throws &&
      //    (players.currentOffset + 1) >= players.order.length &&
      //    (rounds.current + 1) >= rounds.limit)
      //{
      //  // look ahead to see if we hit the round limit hit the round limit
      //  winner = DartHelpers.State.getPlayerIdWithLowestScore(game.players);
      //  notificationQueue.push({type: 'winner', data: winner});
      //  return Object.assign({}, state, {
      //    game,
      //    rounds,
      //    widgetThrows: game.currentThrows.slice(0),
      //    //locked: true, // by not locking we can undo
      //    finished: true,
      //    winner,
      //    notificationQueue: notificationQueue
      //  });
      //}

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
      if (game.players[players.current].score < 0) {
        // advance from a bust
        let score = game.players[players.current].score = game.roundBeginningScore,
            throws = game.players[players.current].throwHistory.length;
        game.players[players.current].history[rounds.current] = 0;

        game.players[players.current].ppd = throws ? ((state.config.variation - score) / throws) : 0;

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
          let winner = DartHelpers.State.getPlayerIdWithLowestScore(game.players);
          return Object.assign({}, state, {
            widgetThrows: game.currentThrows.slice(0),
            finished: true,
            winner,
            notificationQueue: [{type: 'winner', data: winner}]
          });
        }
      } else {
        players.current = players.order[players.currentOffset];
      }

      if (playerChanged) {
        game.roundBeginningScore = game.players[players.current].score;
        game.players[players.current].history[rounds.current] = 0;
        notificationQueue = [];
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
