'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    FilterTypes = DartHelpers.State.FilterTypes;

module.exports = class DartGameServer_JumpUp extends DartHelpers.DartGameServer {
  /**
   * List the allowed value for modifiers.filter. Combine with
   * checkThrowFilter(throw) to see if a throw is valid.
   * @returns {string[]}
   */
  listFiltersAllowed() {
    return [FilterTypes.SINGLES, FilterTypes.DOUBLES, FilterTypes.TRIPLES, FilterTypes.MASTERS];
  }

  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var modifiers = this.formatModifiers(this.getState().game.modifiers);

    return 'Jump Up' + (modifiers ? ` ${modifiers}` : '');
  }

  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @param currentPlayer {object}
   * @returns {object}
   */
  calculateThrowDataValue(throwData, currentPlayer) {
    var number = throwData.number,
        data = {
          value: 0,
          increase_multiplier: 0,
          increase_blinking: 0,
          decrease_remaining: 0
        },
        value_multiplier = 1;

    if (21 === number) {
      // bull calculation is special
      if (currentPlayer.remaining[21]) {
        let bulls_allowed = Math.min(4, currentPlayer.highest_blinking - 20),
            bulls_hit = 4 - currentPlayer.remaining[21];

        if (bulls_allowed > bulls_hit) {
          // we hit a blinking number
          data.increase_multiplier = 1;
          data.increase_blinking = value_multiplier;
          data.decrease_remaining = number;
          value_multiplier *= currentPlayer.multiplier;
        }
        // single and double bull are both worth 50
        data.value = 50 * value_multiplier;
      }

    } else if (currentPlayer.remaining[number]) {
      // calculate the normal value multiplier
      switch (throwData.type) {
        case ThrowTypes.TRIPLE:
          value_multiplier = 3;
          break;

        case ThrowTypes.DOUBLE:
          value_multiplier = 2;
          break;

        case ThrowTypes.SINGLE_INNER:
        case ThrowTypes.SINGLE_OUTER:
          value_multiplier = 1;
          break;
      }

      if (number <= currentPlayer.highest_blinking) {
        // we hit a blinking number
        data.increase_multiplier = 1;
        data.increase_blinking = value_multiplier;
        data.decrease_remaining = number;
        value_multiplier *= currentPlayer.multiplier;
      }
      data.value = number * value_multiplier;
    }
    return data;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param {object} currentPlayer
   * @returns {{}}
   */
  toWidgetDartboard(currentPlayer) {
    var dartboard = {
      visible: false,
      hide: {},
      blink: {},
      highlight: {}
    };

    dartboard.visible = true;

    for (let target in currentPlayer.remaining) {
      if (currentPlayer.remaining.hasOwnProperty(target)) {
        if (currentPlayer.remaining[target]) {
          //visible
          if (target <= currentPlayer.highest_blinking) {
            dartboard.highlight[target] = dartboard.blink[target] = [
              {number: target, type: ThrowTypes.DOUBLE},
              {number: target, type: ThrowTypes.SINGLE_OUTER},
              {number: target, type: ThrowTypes.TRIPLE},
              {number: target, type: ThrowTypes.SINGLE_INNER}
            ];
          }
        } else {
          //hidden
          dartboard.hide[target] = [
            {number: target, type: ThrowTypes.DOUBLE},
            {number: target, type: ThrowTypes.SINGLE_OUTER},
            {number: target, type: ThrowTypes.TRIPLE},
            {number: target, type: ThrowTypes.SINGLE_INNER}
          ];
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
    // cloning the part we need because we're going to overwrite stuff
    var config = Object.assign({}, state.config),
        game = {
          tempScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          modifiers: []
        },
        rounds = Object.assign({}, state.rounds, {limit: 8}),
        remaining = {};

    for (let i = 1; i <= 21; i += 1) {
      remaining[i] = 1;
    }
    remaining[21] = 4;

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('filter')) {
        if (DartHelpers.State.isFilterAllowed(config.modifiers.filter, this.listFiltersAllowed())) {
          game.modifiers.push(DartHelpers.State.getFilterName(config.modifiers.filter));
        } else {
          delete config.modifiers.filter;
        }
      }
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        history: [0],
        throwHistory: [],
        multiplier: 1,
        highest_blinking: 3,
        remaining: Object.assign({}, remaining)
      };
    }

    return Object.assign({}, state, {config, game, rounds});
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
        widgetDartboard: this.toWidgetDartboard(state.game.players[players.current]),
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
          throwStats = this.calculateThrowDataValue(throwData, game.players[players.current]),
          notificationQueue = [throwStats.value ? {type: 'throw', data: throwData} : {type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}];

      game.roundOver = false;
      game.tempScore += throwStats.value;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;

      game.players[players.current].history[rounds.current] = game.tempScore;
      game.players[players.current].throwHistory.push(throwData);
      // @todo: Remove this line once scoring is verified
      game.players[players.current].score += throwStats.value;
      game.players[players.current].multiplier += throwStats.increase_multiplier;
      game.players[players.current].highest_blinking += throwStats.increase_blinking;
      game.players[players.current].remaining[throwStats.decrease_remaining] -= 1;

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
        widgetDartboard: this.toWidgetDartboard(game.players[players.current]),
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
        notificationQueue = [{type: 'throw_darts'}];
      }

      // rebuild the new state
      return Object.assign({}, state, {
        game,
        players,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: false,
        widgetDartboard: this.toWidgetDartboard(game.players[players.current]),
        notificationQueue
      });
    }
    return state;
  }
};
