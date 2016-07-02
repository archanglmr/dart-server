'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Archery extends DartHelpers.DartGameServer {
  /**
   * Handle for INIT
   *
   * @param config {{variation: string, modifiers: object, players: Array, playerOrder: Array}}
   */
  constructor(config) {
    super(config);
  }


  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    return 'Archery';
  }

  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @returns {number}
   */
  calculateThrowDataValue(throwData) {
    var value = 0;

    switch(throwData.type) {
      case ThrowTypes.DOUBLE:
        if (21 === throwData.number) {
          value = 100;
        } else {
          value = 5;
        }
        break;
      case ThrowTypes.SINGLE_OUTER:
        if (21 === throwData.number) {
          value = 50;
        } else {
          value = 10;
        }
        break;
      case ThrowTypes.TRIPLE:
        value = 15;
        break;
      case ThrowTypes.SINGLE_INNER:
        value = 30;
        break;
      default:
        break;
    }
    return value;
  }

  /**
   * Gets the player id of the person with the highest score. If no high score
   * or tie then -1 is returned.
   *
   * @param players
   * @returns {number}
   */
  getPlayerIdWithHighestScore(players) {
    var highScore = 0,
        playerId = -1,
        tied = false;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        let player = players[id],
            score = player.score;

        if (score > highScore) {
          playerId = player.id;
          tied = false;
          highScore = score;
        } else if (score === highScore) {
          playerId = -1;
          tied = true;
        }
      }
    }
    return playerId;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @returns {{}}
   */
  toWidgetDartboard() {
    var dartboard = {
      visible: false,
      //hide: {},
      //blink: {},
      //highlight: {}
    };

    dartboard.visible = true;
    //dartboard.highlight[target] = [
    //  {number: target, type: ThrowTypes.DOUBLE},
    //  {number: target, type: ThrowTypes.SINGLE_OUTER},
    //  {number: target, type: ThrowTypes.TRIPLE},
    //  {number: target, type: ThrowTypes.SINGLE_INNER}
    //];

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
            rounds: Object.assign({}, state.rounds, {limit: 8}),
            roundOver: false
          };

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        history: [0]
      };
    }

    return Object.assign({}, state, {game, rounds: Object.assign({}, game.rounds), widgetDartboard: this.toWidgetDartboard()});
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
      let score = game.players[game.currentPlayer].score = (game.roundBeginningScore + game.tempScore);
      // set the temp score as in the player score history
      game.players[game.currentPlayer].history[game.rounds.current] = game.tempScore;

      game.locked = true;



      // Process advance round
      game.roundOver = ((game.currentThrow + 1) >= game.rounds.throws);

      // sync to the global state

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds: Object.assign({}, game.rounds),
        widgetThrows: game.currentThrows.slice(0),
        locked: game.locked,
        finished: game.finished,
        winner: game.winner
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

        if (game.rounds.limit && game.currentRound >= game.rounds.limit) {
          game.finished = true;
          game.winner = this.getPlayerIdWithHighestScore(game.players);
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
        winner: game.winner
      });
    }
    return state;
  }
};
