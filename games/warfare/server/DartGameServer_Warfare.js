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
   * @param currentPlayerId
   * @returns {{}}
   */
  toWidgetDartboard(game, currentPlayerId) {
    var dartboard = {
      visible: true,
      hide: {},
      blink: {},
      highlight: {}
    };

    for (let id in game.players) {
      if (game.players.hasOwnProperty(id)) {
        let player = game.players[id];
        if (player.id === currentPlayerId) {
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
          tempScore: 0,
          players: {},
          currentThrows: [],
          playerNumbers: {},
          roundOver: false
        },
        players = Object.assign({}, state.players),
        rounds = Object.assign({}, state.rounds, {limit: 0});

    if (state.config.modifiers && state.config.modifiers.hasOwnProperty('limit')) {
      rounds.limit = state.config.modifiers.limit;
    }

    if (players.order.length > 2) {
      players.order = players.order.slice(0, 2);
    } else if (players.order.length < 2) {
      // @fixme: throw min player error
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
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, players, rounds});
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
        widgetDartboard: this.toWidgetDartboard(state.game, players.current)
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
          notificationQueue = [{type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}],
          finished = state.finished,
          winner = state.winner;

      game.roundOver = false;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      let currentPlayerNumber = game.players[players.current].playerNumber,
          otherPlayerId = game.playerNumbers[(1 === currentPlayerNumber) ? 2 : 1];

      if (game.players[players.current].targets[throwData.number]) {
        game.players[players.current].targets[throwData.number] = false;
        game.tempScore += 1;
        notificationQueue = [{type: 'throw', data: throwData}]
      } else if (game.players[otherPlayerId].targets[throwData.number]) {
        game.players[otherPlayerId].targets[throwData.number] = false;
        game.tempScore -= 1;
        notificationQueue = [
          {type: 'throw', data: {type: ThrowTypes.MISS, number: 0}},
          {type: 'team_kill'}
        ];
      } else if (21 === throwData.number) {
        // @todo: regenerate a player
      }

      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      game.players[players.current].score = this.countOpenTargets(game.players[otherPlayerId].targets);
      game.players[otherPlayerId].score = this.countOpenTargets(game.players[players.current].targets);



      if (this.areAllTargetsClosed(game.players[players.current].targets)) {
        finished = true;
        winner = players.current;
        notificationQueue.push(this.buildWinnerNotification(winner));
      }

      // Process advance round
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      if (game.roundOver && !winner) {
        notificationQueue.push({type: 'remove_darts'});
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: !winner,
        finished,
        winner,
        widgetDartboard: this.toWidgetDartboard(game, players.current),
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
        game.target += 1;

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
        notificationQueue = [];
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: false,
        widgetDartboard: this.toWidgetDartboard(game, players.current),
        notificationQueue
      });
    }
    return state;
  }
};
