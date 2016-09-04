'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Archery extends DartHelpers.DartGameServer {
  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param targets {object}
   * @returns {{markType: string, value: number}}
   */
  calculateThrowDataValue(throwData, targets) {
    var data = {markType: 'miss', value: 0};

    switch(throwData.type) {
      case ThrowTypes.DOUBLE:
        if (21 === throwData.number) {
          data.markType = 'double_bull';
          data.value = targets.double_bull;
        } else {
          data.markType = 'double';
          data.value = targets.double;
        }
        break;
      case ThrowTypes.SINGLE_OUTER:
        if (21 === throwData.number) {
          data.markType = 'single_bull';
          data.value = targets.single_bull;
        } else {
          data.markType = 'outer';
          data.value = targets.outer;
        }
        break;
      case ThrowTypes.TRIPLE:
        data.markType = 'triple';
        data.value = targets.triple;
        break;
      case ThrowTypes.SINGLE_INNER:
        data.markType = 'inner';
        data.value = targets.inner;
        break;
      default:
        break;
    }
    return data;
  }

  /**
   * Returns the number of bulls in a throwData
   *
   * @param throwData {{type: string, number: number}}
   * @returns {number}
   */
  countBulls(throwData) {
    var bulls = 0;

    if (21 === throwData.number) {
      switch(throwData.type) {
        case ThrowTypes.DOUBLE:
          bulls = 2;
          break;
        case ThrowTypes.SINGLE_OUTER:
          bulls = 1;
          break;
      }
    }
    return bulls;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param throwList {Array}
   * @returns {{}}
   */
  toWidgetDartboard(throwList = []) {
    var dartboard = {
      visible: true,
      highlight: {}
    };

    for (let i = 0, c = throwList.length; i < c; i += 1) {
      let throwData = throwList[i];
      if (!dartboard.highlight[throwData.number]) {
        dartboard.highlight[throwData.number] = [];
      }
      dartboard.highlight[throwData.number].push(throwData);
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
    // cloning the part we need because we're going to overwrite stuff
    var game = {
          tempScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          targets: {
            double_bull: 100,
            single_bull: 50,
            inner: 30,
            triple: 15,
            outer: 10,
            double: 5
          }
        },
        rounds = Object.assign({}, state.rounds, {limit: 8});

    if (state.config.modifiers && state.config.modifiers.hasOwnProperty('limit')) {
      rounds.limit = state.config.modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        history: [[]],
        throwHistory: [],
        bulls: 0
      };
    }

    return Object.assign({}, state, {game, rounds, widgetDartboard: this.toWidgetDartboard()});
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
          throwStats = this.calculateThrowDataValue(throwData, game.targets);

      game.roundOver = false;
      game.tempScore += throwStats.value;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      game.players[players.current].history[rounds.current].push(throwStats);
      game.players[players.current].throwHistory.push(throwData);
      game.players[players.current].score += throwStats.value;
      game.players[players.current].bulls += this.countBulls(throwData);

      // Process advance round
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      if (game.roundOver) {
        notificationQueue = notificationQueue.concat(
            (this.checkForHatTrickNotifications(game.currentThrows) || []),
            [{type: 'remove_darts'}]
        );
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: true,
        widgetDartboard: this.toWidgetDartboard(game.currentThrows),
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
        widgetDartboard: this.toWidgetDartboard(game.currentThrows),
        notificationQueue
      });
    }
    return state;
  }
};
