'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Shanghai extends DartHelpers.DartGameServer {
  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param target {number}
   * @returns {number}
   */
  calculateThrowDataValue(throwData, target) {
    var value = 0;

    if (target === throwData.number) {
      value = throwData.number;

      switch(throwData.type) {
        case ThrowTypes.TRIPLE:
          value *= 3;
          break;
        case ThrowTypes.DOUBLE:
          value *= 2;
          break;

        case ThrowTypes.MISS:
        case ThrowTypes.SINGLE_INNER:
        case ThrowTypes.SINGLE_OUTER:
          break;
      }
    }
    return value;
  }

  /**
   * Checks a list of throws and determines if it's considered a shanghai.
   *
   * @param throwList
   * @param target
   * @returns {number}
   */
  isShanghai(throwList, target) {
    var types = {
      triple: 0,
      double: 0,
      single: 0
    };
    for (let i = 0, c = throwList.length; i < c; i += 1) {
      if (throwList[i].number === target) {
        switch(throwList[i].type) {
          case ThrowTypes.TRIPLE:
            types.triple += 1;
            break;
          case ThrowTypes.DOUBLE:
            types.double += 1;
            break;

          case ThrowTypes.SINGLE_INNER:
          case ThrowTypes.SINGLE_OUTER:
            types.single += 1;
            break;
        }
      }

    }

    return types.triple && types.double && types.single;
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
    // cloning the part we need because we're going to overwrite stuff
    var game = {
          tempScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          target: 0
        },
        rounds = Object.assign({}, state.rounds);

    if (state.config.modifiers && state.config.modifiers.limit) {
      rounds.limit = state.config.modifiers.limit;
    }
    rounds.limit = Math.min(20, rounds.limit);
    game.target = (20 - rounds.limit) + 1;

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, rounds, widgetDartboard: this.toWidgetDartboard(game.target)});
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
          throwScore = this.calculateThrowDataValue(throwData, game.target),
          notificationQueue = [throwScore ? {type: 'throw', data: throwData} : {type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}],
          finished = state.finished,
          winner = state.winner;

      game.roundOver = false;
      game.tempScore += throwScore;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].score += throwScore;



      // Process advance round
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      if (game.roundOver) {
        // check for shanghai here
        if (throwScore && this.isShanghai(game.currentThrows, game.target)) {
          finished = true;
          winner = players.current;
          // @fixme: should be a shanghai notification
          notificationQueue.push({type: 'winner', data: game.winner});
        }
        notificationQueue.push({type: 'remove_darts'});
      }

      // sync to the global state

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: !winner, // by not locking we can undo,
        finished: finished,
        winner: winner,
        widgetDartboard: this.toWidgetDartboard(game.target),
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
          let winner = DartHelpers.State.getPlayerIdWithHighestScore(game.players);
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
        game.players[players.current].history[rounds.current] = [];
        notificationQueue = [];
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: false,
        widgetDartboard: this.toWidgetDartboard(game.target),
        notificationQueue
      });
    }
    return state;
  }
};
