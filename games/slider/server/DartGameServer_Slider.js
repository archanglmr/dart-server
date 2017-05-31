'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    FilterTypes = DartHelpers.State.FilterTypes;

module.exports = class DartGameServer_Slider extends DartHelpers.DartGameServer {
  /**
   * List the allowed value for modifiers.filter. Combine with
   * checkThrowFilter(throw) to see if a throw is valid.
   * @returns {string[]}
   */
  listFiltersAllowed() {
    return [FilterTypes.SINGLES, FilterTypes.DOUBLES, FilterTypes.TRIPLES, FilterTypes.MASTERS, FilterTypes.SINGLE_INNER, FilterTypes.SINGLE_OUTER];
  }

  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var state = this.getState(),
        modifiers = this.formatModifiers(state.game.modifiers);

    return 'Slider' + (modifiers ? ` ${modifiers}` : '');
  }


  /**
   * Calculates the value in of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param target {number}
   * @returns {number}
   */
  calculateThrowDataValue(throwData, target) {
    if (21 === target && target === throwData.number) {
      return 1;
    }
    return (this.isFilteredThrow(throwData) && target === throwData.number) ? 1 : 0;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param target {number}
   * @param currentPlayer {object}
   * @returns {{}}
   */
  toWidgetDartboard(target, currentPlayer) {
    var dartboard = {
          visible: true,
          hide: {},
          blink: {},
          highlight: {}
        };

    if (target <= (this.isBullRequired() ? 21 : 20)) {
      let single_outer = {number: target, type: ThrowTypes.SINGLE_OUTER},
          single_inner = {number: target, type: ThrowTypes.SINGLE_INNER},
          double = {number: target, type: ThrowTypes.DOUBLE},
          triple = {number: target, type: ThrowTypes.TRIPLE};

      dartboard.highlight[target] = [];

      if (21 === parseInt(target)) {
        dartboard.highlight[target].push(single_outer);
        dartboard.highlight[target].push(double);
      } else {
        if (this.isFilteredThrow(single_outer)) {
          dartboard.highlight[target].push(single_outer);
        }
        if (this.isFilteredThrow(single_inner)) {
          dartboard.highlight[target].push(single_inner);
        }
        if (this.isFilteredThrow(double)) {
          dartboard.highlight[target].push(double);
        }
        if (this.isFilteredThrow(triple)) {
          dartboard.highlight[target].push(triple);
        }
      }

      dartboard.blink[target] = dartboard.highlight[target];
    } else if (currentPlayer && currentPlayer.winner) {
      dartboard.highlight = this.highlightHistory(currentPlayer.advanceHistory);
    }

    return dartboard;
  }

  /**
   * Returns the players history up till the last number (presumably winning
   * number) back to the start. This will be used to light up the hits that
   * caused advancement and the win back to number 10.
   *
   * @param history {object}
   * @returns {{}}
   */
  highlightHistory(history) {
    var transformed = {};

    for (let i in history) {
      if (history.hasOwnProperty(i)) {
        transformed[history[i].number] = [history[i]];
      }
    }

    return transformed;
  }

  /**
   * Checks to see if this the bull_required modifier is on.
   *
   * @returns {boolean}
   */
  isBullRequired() {
    if (undefined === this.bull_required) {
      let config = this.getState().config;
      this.bull_required = (config.modifiers && config.modifiers.bull_required);
    }
    return this.bull_required;
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
          players: {},
          currentThrows: [],
          roundOver: false,
          target: 10,
          modifiers: []
        },
        rounds = Object.assign({}, state.rounds);

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('limit')) {
        rounds.limit = config.modifiers.limit;
      }
      if (config.modifiers.hasOwnProperty('filter')) {
        if (DartHelpers.State.isFilterAllowed(config.modifiers.filter, this.listFiltersAllowed())) {
          game.modifiers.push(DartHelpers.State.getFilterName(config.modifiers.filter));
        } else {
          delete config.modifiers.filter;
        }
      }
      if (config.modifiers.hasOwnProperty('bull_required')) {
        if (true === config.modifiers.bull_required) {
          game.modifiers.push('Bull Required');
        } else {
          delete config.modifiers.bull_required;
        }
      }
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: game.target,
        history: [0],
        throwHistory: [],
        advanceHistory: {}
      };
    }

    return Object.assign({}, state, {config, game, rounds, widgetDartboard: this.toWidgetDartboard(game.target)});
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
        widgetDartboard: this.toWidgetDartboard(state.game.target),
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
          throwScore = this.calculateThrowDataValue(throwData, game.target),
          notificationQueue = [throwScore ? {type: 'throw', data: throwData} : {type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}],
          finished = state.finished,
          winner = state.winner;

      game.roundOver = false;
      game.tempScore += throwScore;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      let score = game.players[players.current].score += throwScore;

      if (throwScore) {
        game.players[players.current].advanceHistory[throwData.number] = throwData;
      }

      if (score === (this.isBullRequired() ? 22 : 21)) {
        finished = true;
        winner = players.current;
        game.players[players.current].winner = true;
        notificationQueue.push(this.buildWinnerNotification(winner));
      }

      // Process advance round
      game.roundOver = (rounds.currentThrow >= rounds.throws);
      game.target = score;

      if (game.roundOver) {
        if (!game.tempScore && score > 1) {
          // slide back one, lowest number you can have is 1
          game.players[players.current].score -= 1;
          game.players[players.current].history[rounds.current] = -1;
          //game.target = 'SLIDE';
          game.target -= 1;
          notificationQueue.push({type: 'slide'});
        }
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
        widgetDartboard: this.toWidgetDartboard(game.target, game.players[players.current]),
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
        game.target = game.players[players.current].score;
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
        widgetDartboard: this.toWidgetDartboard(game.target),
        notificationQueue
      });
    }
    return state;
  }
};
