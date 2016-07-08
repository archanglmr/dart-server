'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Slider extends DartHelpers.DartGameServer {
  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param target {number}
   * @returns {number}
   */
  calculateThrowDataValue(throwData, target) {
    return (target === throwData.number) ? 1 : 0;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param {object} targets
   * @returns {{}}
   */
  toWidgetDartboard(target) {
    var dartboard = {
      visible: false,
      hide: {},
      blink: {},
      highlight: {}
    };

    dartboard.visible = true;
    dartboard.blink[target] = dartboard.highlight[target] = [
      {number: target, type: ThrowTypes.DOUBLE},
      {number: target, type: ThrowTypes.SINGLE_OUTER},
      {number: target, type: ThrowTypes.TRIPLE},
      {number: target, type: ThrowTypes.SINGLE_INNER}
    ];

    return dartboard;
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
            rounds: Object.assign({}, state.rounds, {limit: 0}),
            roundOver: false,
            target: 10
          };

    if (modifiers && modifiers.limit) {
      game.rounds.limit = modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: game.target,
        history: [0]
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
        widgetDartboard: this.toWidgetDartboard(game.target)
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


      game.tempScore += this.calculateThrowDataValue(throwData, game.target);
      game.currentThrows.push(throwData);

      let score = game.players[game.currentPlayer].score = (game.roundBeginningScore + game.tempScore);
      // set the temp score as in the player score history
      game.players[game.currentPlayer].history[game.rounds.current] = game.tempScore;

      if (21 === score) {
        game.finished = true;
        game.winner = game.currentPlayer;
      }

      // Process advance round
      game.roundOver = ((game.currentThrow + 1) >= game.rounds.throws);
      game.target = score;

      if (game.roundOver && !game.tempScore && score > 1) {
        // slide back one, lowest number you can have is 1
        game.players[game.currentPlayer].score -= 1;
        game.players[game.currentPlayer].history[game.rounds.current] = -1;
        game.target = 'SLIDE';
      }

      game.locked = true;

      // sync to the global state

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds: Object.assign({}, game.rounds),
        widgetThrows: game.currentThrows.slice(0),
        locked: game.locked,
        finished: game.finished,
        winner: game.winner,
        widgetDartboard: this.toWidgetDartboard(game.target)
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


      if (game.playerOffset >= players.order.length) {
        // next round actually
        game.playerOffset = 0;
        playerChanged = true;
        game.currentRound += 1;
        game.currentPlayer = players.order[game.playerOffset];
        game.target += 1;

        if (game.rounds.limit && game.currentRound >= game.rounds.limit) {
          game.finished = true;
          game.winner = DartHelpers.State.getPlayerIdWithHighestScore(game.players);
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
        game.target = game.roundBeginningScore = game.players[game.currentPlayer].score;
        game.players[game.currentPlayer].history[game.currentRound] = 0;
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
        widgetDartboard: this.toWidgetDartboard(game.target)
      });
    }
    return state;
  }
};