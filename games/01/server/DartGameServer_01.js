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
    var config = Object.assign({}, state.config),
    // cloning the part we need because we're going to overwrite stuff
          game = {
            started: state.started,
            locked: state.locked,
            finished: state.finished,
            winner: state.winner,
            tempScore: 0,
            players: {},
            rounds: Object.assign({}, state.rounds),
            roundOver: false
          };

    this.registerPlugin(new WindicatorPlugin(new Windicator(this.calculateThrowDataValue, config.extras), (state) => state.game.players[state.game.currentPlayer].score));

    if (!config.variation) {
      config.variation = 501;
    } else {
      config.variation = parseInt(config.variation, 10);
    }
    if (config.modifiers && config.modifiers.limit) {
      game.rounds.limit = config.modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: config.variation,
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, rounds: Object.assign({}, game.rounds), config});
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
      let game = Object.assign({}, state.game),
          players = Object.assign({}, state.players);

      game.playerOffset = 0;
      game.currentPlayer = state.players.order[game.playerOffset];
      game.currentRound = 0;
      game.currentThrow = 0;
      game.currentThrows = [];

      game.tempScore = 0;
      game.roundBeginningScore = state.game.players[game.currentPlayer].score;

      game.widgetWindicator = [];

      game.started = true;
      game.locked = false;


      // sync to the global state
      players.current = game.currentPlayer;

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        started: game.started,
        locked: game.locked
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
      let game = Object.assign({}, state.game);


      game.tempScore += this.calculateThrowDataValue(throwData);
      game.currentThrows.push(throwData);

      // @todo: check to make sure assigning game.players[x].score is safe
      let score = game.players[game.currentPlayer].score = (game.roundBeginningScore - game.tempScore);
      // set the temp score as in the player score history
      game.players[game.currentPlayer].history[game.rounds.current] = game.tempScore;
      game.players[game.currentPlayer].throwHistory.push(throwData);
      if (0 === score) {
        game.finished = true;
        game.winner = game.currentPlayer;
        console.log('WINNER');
      }

      game.locked = true;



      // Process BUST or advance round
      game.roundOver = ((score < 0) || ((game.currentThrow + 1) >= game.rounds.throws));
      // @todo: bust notification here

      // sync to the global state

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds: Object.assign({}, game.rounds),
        widgetThrows: game.currentThrows.slice(0),
        locked: game.locked,
        finished: game.finished,
        winner: game.winner,
        notificationQueue: [{type: 'throw', data: throwData}]
      });
    }
    return state;
  }


  actionAdvanceGame(state) {
    if (state.locked && DartHelpers.State.isPlayable(state)) {
      // we're in a valid round

      // shallow clone stuff
      let game = Object.assign({}, state.game),
          players = Object.assign({}, state.players),
          playerChanged = false,
          notificationQueue = state.notificationQueue;


      // Process BUST
      if (game.players[game.currentPlayer].score < 0) {
        // advance from a bust
        game.players[game.currentPlayer].score = game.roundBeginningScore;
        game.players[game.currentPlayer].history[game.rounds.current] = 0;

        game.currentThrow = 0;
        game.tempScore = 0;
        game.playerOffset += 1;
        playerChanged = true;

        game.currentThrows = [];
      } else {
        // advance the game normally
        game.currentThrow += 1;
        if (game.currentThrow >= game.rounds.throws) {
          // next player
          game.currentThrow = 0;
          game.tempScore = 0;
          game.playerOffset += 1;
          playerChanged = true;

          game.currentThrows = [];
        }
      }


      if (game.playerOffset >= players.order.length) {
        // @todo: test if last round?

        // next round actually
        game.playerOffset = 0;
        playerChanged = true;
        game.currentRound += 1;
        game.currentPlayer = players.order[game.playerOffset];

        if (game.rounds.limit && game.currentRound >= game.rounds.limit) {
          game.finished = true;
          game.winner = DartHelpers.State.getPlayerIdWithLowestScore(game.players);
          notificationQueue = [];
          return Object.assign({}, state, {
            game,
            players,
            rounds: Object.assign({}, game.rounds),
            widgetThrows: game.currentThrows.slice(0),
            locked: game.locked,
            finished: game.finished,
            winner: game.winner,
            notificationQueue
          });
        }
      } else {
        game.currentPlayer = players.order[game.playerOffset];
      }

      if (playerChanged) {
        game.roundBeginningScore = game.players[game.currentPlayer].score;
        game.players[game.currentPlayer].history[game.currentRound] = 0;
        notificationQueue = [];
      }

      game.locked = false;

      // sync to the global state
      players.current = game.currentPlayer;
      game.rounds.current = game.currentRound;

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        rounds: Object.assign({}, game.rounds),
        widgetThrows: game.currentThrows.slice(0),
        locked: game.locked,
        finished: game.finished,
        winner: game.winner,
        notificationQueue
      });
    }
    return state;
  }
};
