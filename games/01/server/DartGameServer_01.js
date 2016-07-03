'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    Windicator = require('./Windicator');

module.exports = class DartGameServer_01 extends DartHelpers.DartGameServer {
  /**
   * Handle for INIT
   *
   * @param config {{variation: string, modifiers: object, players: Array, playerOrder: Array}}
   */
  constructor(config) {
    super(config);

    this.windicator = new Windicator(this.calculateThrowDataValue);
  }


  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    return this.getState().config.variation;
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

  /**
   * Gets the player id of the person with the lowest score. If no low score
   * or tie then -1 is returned.
   *
   * @param players
   * @returns {number}
   */
  getPlayerIdWithLowestScore(players) {
    var lowScore = null,
        playerId = -1,
        tied = false;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        let player = players[id],
            score = player.score;

        if (null === lowScore) {
          playerId = player.id;
          lowScore = score;
        } else if (score < lowScore) {
          playerId = player.id;
          tied = false;
          lowScore = score;
        } else if (score === lowScore) {
          playerId = -1;
          tied = true;
        }
      }
    }
    return playerId;
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
    var {variation, modifiers} = state.config,
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

    if (modifiers && modifiers.limit) {
      game.rounds.limit = modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: parseInt(state.config.variation, 10),
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, rounds: Object.assign({}, game.rounds)});
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

      game.widgetWindicator = this.windicator.calculate(
          game.roundBeginningScore,
          game.rounds.throws - (game.currentThrow)
      );

      game.started = true;
      game.locked = false;


      // sync to the global state
      players.current = game.currentPlayer;

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        started: game.started,
        locked: game.locked,
        widgetDartboard: this.windicator.toWidgetDartboard()
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

      // windicator
      game.widgetWindicator = this.windicator.calculate(
          score,
          game.rounds.throws - (game.currentThrow + 1),
          game.players[game.currentPlayer].throwHistory
      );

      game.locked = true;



      // Process BUST or advance round
      game.roundOver = ((score < 0) || ((game.currentThrow + 1) >= game.rounds.throws));

      // sync to the global state

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds: Object.assign({}, game.rounds),
        widgetThrows: game.currentThrows.slice(0),
        locked: game.locked,
        finished: game.finished,
        winner: game.winner,
        widgetDartboard: this.windicator.toWidgetDartboard()
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
          playerChanged = false;


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
          game.winner = this.getPlayerIdWithLowestScore(game.players);
          return Object.assign({}, state, {
            game,
            players,
            rounds: Object.assign({}, game.rounds),
            widgetThrows: game.currentThrows.slice(0),
            locked: game.locked,
            finished: game.finished,
            winner: game.winner
          });
        }
      } else {
        game.currentPlayer = players.order[game.playerOffset];
      }

      if (playerChanged) {
        game.roundBeginningScore = game.players[game.currentPlayer].score;
        game.players[game.currentPlayer].history[game.currentRound] = 0;

        // windicator
        game.widgetWindicator = this.windicator.calculate(
            game.players[game.currentPlayer].score,
            game.rounds.throws - game.currentThrow,
            game.players[game.currentPlayer].throwHistory
        );
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
        widgetDartboard: this.windicator.toWidgetDartboard()
      });
    }
    return state;
  }
};
