'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Warfare extends DartHelpers.DartGameServer {
  /**
   * Checks a targets object to see if there they are all closed. true is open,
   * false is closed
   *
   * @param {object} targets
   * @returns {boolean}
   */
  areAllTargetsClosed(targets) {
    for (let number in targets) {
      if (targets.hasOwnProperty(number) && targets[number]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Takes a list of targets and counts how many are still open
   *
   * @param targets
   * @returns {number}
   */
  countOpenTargets(targets) {
    var count = 0;
    for (let number in targets) {
      if (targets.hasOwnProperty(number) && targets[number]) {
        count += 1;
      }
    }
    return count;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param {object} game
   * @returns {{}}
   */
  toWidgetDartboard(game) {
    var dartboard = {
      visible: true,
      hide: {},
      blink: {},
      highlight: {}
    };

    for (let id in game.players) {
      if (game.players.hasOwnProperty(id)) {
        let player = game.players[id];
        if (player.id === game.currentPlayer) {
          for (let number in player.targets) {
            if (player.targets.hasOwnProperty(number)) {
              if (player.targets[number]) {
                // @todo: add color here
                dartboard.highlight[number] = dartboard.blink[number] = [
                    {number, type: ThrowTypes.DOUBLE},
                    {number, type: ThrowTypes.SINGLE_OUTER},
                    {number, type: ThrowTypes.TRIPLE},
                    {number, type: ThrowTypes.SINGLE_INNER}
                ];
              } else {
                dartboard.hide[number] = [
                  {number, type: ThrowTypes.DOUBLE},
                  {number, type: ThrowTypes.SINGLE_OUTER},
                  {number, type: ThrowTypes.TRIPLE},
                  {number, type: ThrowTypes.SINGLE_INNER}
                ];
              }
            }
          }
        } else {
          for (let number in player.targets) {
            if (player.targets.hasOwnProperty(number)) {
              if (player.targets[number]) {
                // @todo add color here
              } else {
                dartboard.hide[number] = [
                  {number, type: ThrowTypes.DOUBLE},
                  {number, type: ThrowTypes.SINGLE_OUTER},
                  {number, type: ThrowTypes.TRIPLE},
                  {number, type: ThrowTypes.SINGLE_INNER}
                ];
              }
            }
          }
        }
      }
    }

    //game.players[game.currentPlayer].targets

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
          playerNumbers: {},
          rounds: Object.assign({}, state.rounds, {limit: 0}),
          roundOver: false
        },
        players = Object.assign({}, state.players);

    if (modifiers && modifiers.limit) {
      game.rounds.limit = modifiers.limit;
    }

    if (players.order.length > 2) {
      players.order = players.order.slice(0, 2);
    }

    for (let i = 0, c = players.order.length; i < c; i += 1) {
      let id = players.order[i],
          playerNumber = i + 1;

      game.playerNumbers[playerNumber] = id;
      game.players[id] = {
        id,
        playerNumber: playerNumber,
        score: 10,
        targets: (i ?
            {
              20: true,
              5: true,
              1: true,
              12: true,
              18: true,
              9: true,
              4: true,
              14: true,
              13: true,
              11: true
            } :
            {
              3: true,
              17: true,
              19: true,
              2: true,
              7: true,
              15: true,
              16: true,
              10: true,
              8: true,
              6: true
            }
        ),
        history: [0]
      };
    }

    return Object.assign({}, state, {game, players, rounds: Object.assign({}, game.rounds)});
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
        widgetDartboard: this.toWidgetDartboard(game)
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

      game.currentThrows.push(throwData);

      let currentPlayerNumber = game.players[game.currentPlayer].playerNumber,
          otherPlayerId = game.playerNumbers[(1 === currentPlayerNumber) ? 2 : 1];

      if (game.players[game.currentPlayer].targets[throwData.number]) {
        game.players[game.currentPlayer].targets[throwData.number] = false;
        game.tempScore += 1;
      } else if (game.players[otherPlayerId].targets[throwData.number]) {
        game.players[otherPlayerId].targets[throwData.number] = false;
        game.tempScore -= 1;
      } else if (21 === throwData.number) {
        // @todo: regenerate a player
      }

      game.players[game.currentPlayer].score = this.countOpenTargets(game.players[otherPlayerId].targets);
      game.players[otherPlayerId].score = this.countOpenTargets(game.players[game.currentPlayer].targets);
      // set the temp score as in the player score history
      game.players[game.currentPlayer].history[game.rounds.current] = game.tempScore;

      if (this.areAllTargetsClosed(game.players[game.currentPlayer].targets)) {
        game.finished = true;
        game.winner = game.currentPlayer;
      }

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
        winner: game.winner,
        widgetDartboard: this.toWidgetDartboard(game)
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
        widgetDartboard: this.toWidgetDartboard(game)
      });
    }
    return state;
  }
};
