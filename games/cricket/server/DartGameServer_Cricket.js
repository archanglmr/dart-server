'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Cricket extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    var state = this.getState(),
    name = state.game.label || state.config.variation || 'standard';

    return name.substr(0, 1).toUpperCase() + name.substr(1) + ' Cricket';
  }


  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @returns {{marks: number, value: number}}
   */
  calculateThrowDataValue(throwData) {
    var number = throwData.number,
        data = {marks: 0, value: 0};

    if (this.getState().game.targets.hasOwnProperty(number)) {
      data.value = 21 === number ? 25 : number;

      switch(throwData.type) {
        case ThrowTypes.TRIPLE:
          if (25 !== data.value) {
            data.marks = 3;
          }
          break;

        case ThrowTypes.DOUBLE:
          /*
           if you wanted different rules for double bull this is the place to
           put them
           */
          data.marks = 2;
          break;

        case ThrowTypes.SINGLE_INNER:
        case ThrowTypes.SINGLE_OUTER:
          data.marks = 1;
          break;
      }
    }
    //data.value *= data.marks;

    return data;
  }

  /**
   * Checks the game to see if a number is still open.
   *
   * @param number
   * @returns {boolean}
   */
  isNumberOpen(number) {
    return (this.isNumberInGame(number) && this.getState().game.targets[number]);
  }

  /**
   * Checks to see if the number is in the game. Different numbers can be in
   * different variations.
   *
   * @param number
   * @returns {boolean}
   */
  isNumberInGame(number) {
    return this.getState().game.targets.hasOwnProperty(number);
  }

  /**
   * Checks the number against all the players to see if it's closed. This is
   * good to cache at the end.
   *
   * @param number {int}
   * @returns {boolean}
   */
  isNumberOpenInPlayers(number) {
    let state = this.getState();

    // Never close a number if there is only one player
    if (1 === state.players.order.length) {
      return true;
    }

    let players = state.game.players;

    for (let id in players) {
      if (players.hasOwnProperty(id) && players[id].marks[number] < 3) {
        return true;
      }
    }

    return false;
  }

  /**
   * Takes a list of players and checks the high score (excluding the passed
   * player id)
   *
   * @param players
   * @param excludePlayerId
   * @returns {number}
   */
  getHighestScore(players, excludePlayerId = 0) {
    var highScore = 0;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        let player = players[id];
        if (player.id !== excludePlayerId) {
          highScore = Math.max(highScore, player.score);
        }
      }
    }
    return highScore;
  }

  /**
   * Checks a marks object to see if there are three or more marks for each
   * number.
   *
   * @param {object} marks
   * @returns {boolean}
   */
  areAllMarksClosed(marks) {
    for (let number in marks) {
      if (marks.hasOwnProperty(number) && marks[number] < 3) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks a marks object to see if there are three or more marks for each
   * number.
   *
   * @param {object} marks
   * @returns {number}
   */
  countMarksClosed(marks) {
    var marksClosed = 0;
    for (let number in marks) {
      if (marks.hasOwnProperty(number) && marks[number] >= 3) {
        marksClosed += 1;
      }
    }
    return marksClosed;
  }

  isCloseout() {
    if (undefined === this.closeout) {
      this.closeout = 'Closeout' === this.getState().config.variation;
    }
    return this.closeout;
  }

  /**
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param {object} game
   * @returns {{}}
   */
  toWidgetDartboard(game) {
    var targets = Object.assign({}, game.targets),
      dartboard = {
          visible: false,
          highlight: {}
        };

    if (this.isCloseout()) {
      let currentPlayerMarks = game.players[game.currentPlayer].marks;
      for (let mark in currentPlayerMarks) {
        if (currentPlayerMarks.hasOwnProperty(mark)) {
          targets[mark] = (currentPlayerMarks[mark] < 3);
        }
      }
    }

    for (let number in targets) {
      if (targets.hasOwnProperty(number) && targets[number]) {
        dartboard.visible = true;
        dartboard.highlight[number] = [
          {number: number, type: ThrowTypes.DOUBLE},
          {number: number, type: ThrowTypes.SINGLE_OUTER}
        ];
        if (21 !== number) {
          dartboard.highlight[number].push({number: number, type: ThrowTypes.TRIPLE});
          dartboard.highlight[number].push({number: number, type: ThrowTypes.SINGLE_INNER});
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
    var {modifiers} = state.config,
        // cloning the part we need because we're going to overwrite stuff
        game = {
          started: state.started,
          locked: state.locked,
          finished: state.finished,
          winner: state.winner,
          tempScore: 0,
          players: {},
          rounds: Object.assign({}, state.rounds),
          roundOver: false,
          // true means open, false means closed
          targets: {20: true, 19: true, 18: true, 17: true, 16: true, 15: true, 21: true}
        },
        marks = {};

    // init the marks for this game
    for (let target in game.targets) {
      if (game.targets.hasOwnProperty(target)) {
        marks[target] = 0;
      }
    }

    if (modifiers && modifiers.limit) {
      game.rounds.limit = modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        marks: Object.assign({}, marks),
        highlightMarks: {},
        history: [[]]
      };
    }

    return Object.assign({}, state, {
      game,
      rounds: Object.assign({}, game.rounds)
    });
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
      let game = Object.assign({}, state.game),
          currentPlayer = Object.assign({}, game.players[game.currentPlayer]),
          notificationQueue = [{type: 'throw', data: throwData}];

      // recorded the throw and init the history if needed
      game.currentThrows.push(throwData);

      if (this.isNumberOpen(throwData.number)) {
        // process only if the number is open
        let throwStats = this.calculateThrowDataValue(throwData),
            currentMarks = currentPlayer.marks[throwData.number],
            neededMarks = Math.max(0, (3 - currentMarks)),

            // give marks
            earnedMarks = Math.min(neededMarks, throwStats.marks),
            excessMarks = throwStats.marks - earnedMarks;

        currentPlayer.marks[throwData.number] += earnedMarks;
        currentPlayer.highlightMarks[throwData.number] = (currentPlayer.highlightMarks[throwData.number] || 0) + earnedMarks;
        currentPlayer.history[game.rounds.current].push(earnedMarks);

        // check to see if this closes the number globally and assign the value
        if ((game.targets[throwData.number] = this.isNumberOpenInPlayers(throwData.number))) {
          // give points if allowed
          if (!this.isCloseout()) {
            let points = excessMarks * throwStats.value;
            currentPlayer.marks[throwData.number] += excessMarks;
            game.tempScore += points;
            currentPlayer.score += points;
          }
        }

        if (this.isCloseout()) {
          if (earnedMarks && currentPlayer.marks[throwData.number] >= 3) {
            game.tempScore += 1;
            currentPlayer.score += 1;
          }
        }

        // do this early so we can use the updated game object
        game.players[game.currentPlayer] = currentPlayer;

        // check win condition
        if (
          this.areAllMarksClosed(currentPlayer.marks) &&
          (
            this.isCloseout() ||
            (currentPlayer.score >= this.getHighestScore(game.players, currentPlayer.id))
          )
        ) {
            game.winner = currentPlayer.id;
            game.finished = true;
        }
      } else {
        currentPlayer.history[game.rounds.current].push(0);
        game.players[game.currentPlayer] = currentPlayer;
        notificationQueue = [{type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}];
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
        widgetDartboard: this.toWidgetDartboard(game),
        notificationQueue: notificationQueue
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


      // advance the game normally
      game.currentThrow += 1;
      if (game.currentThrow >= game.rounds.throws) {
        // next player
        game.currentThrow = 0;
        game.tempScore = 0;
        game.playerOffset += 1;
        playerChanged = true;

        game.currentThrows = [];
        game.players[game.currentPlayer].highlightMarks = {};
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
          game.winner = DartHelpers.State.getPlayerIdWithHighestScore(game.players);
          notificationQueue = [];
          return Object.assign({}, state, {
            game,
            players,
            rounds: Object.assign({}, game.rounds),
            locked: game.locked,
            finished: game.finished,
            winner: game.winner,
            widgetThrows: game.currentThrows.slice(0),
            notificationQueue
          });
        }
      } else {
        game.currentPlayer = players.order[game.playerOffset];
      }

      if (playerChanged) {
        game.roundBeginningScore = game.players[game.currentPlayer].score;
        game.players[game.currentPlayer].history[game.currentRound] = [];
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
        locked: game.locked,
        finished: game.finished,
        winner: game.winner,
        widgetThrows: game.currentThrows.slice(0),
        widgetDartboard: this.toWidgetDartboard(game),
        notificationQueue
      });
    }
    return state;
  }
};