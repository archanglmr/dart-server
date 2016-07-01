'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_Cricket extends DartHelpers.DartGameServer {
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
    var name = this.getState().config.variation;

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
    let players = this.getState().game.players;

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
   * Will look at the current game state and return an object compatible with
   * the state.widgetDartboard property and WidgetDartboard component.
   *
   * @param {object} targets
   * @returns {{}}
   */
  toWidgetDartboard(targets) {
    var dartboard = {
          visible: false,
          hide: {},
          blink: {},
          highlight: {}
        };

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
        widgetDartboard: this.toWidgetDartboard(game.targets)
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
          currentPlayer = Object.assign({}, game.players[game.currentPlayer]);

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
          let points = excessMarks * throwStats.value;
          currentPlayer.marks[throwData.number] += excessMarks;
          game.tempScore += points;
          currentPlayer.score += points;
        }

        // do this early so we can use the updated game object
        game.players[game.currentPlayer] = currentPlayer;

        // check win condition
        if (
          this.areAllMarksClosed(currentPlayer.marks) &&
          (currentPlayer.score >= this.getHighestScore(game.players, currentPlayer.id))
        ) {
            game.winner = currentPlayer.id;
            game.finished = true;
        }
      } else {
        currentPlayer.history[game.rounds.current].push(0);
        game.players[game.currentPlayer] = currentPlayer;
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
        widgetDartboard: this.toWidgetDartboard(game.targets)
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
          game.winner = this.getPlayerIdWithHighestScore(game.players);
          game.finished = true;
          return Object.assign({}, state, {
            game,
            players,
            rounds: Object.assign({}, game.rounds),
            locked: game.locked,
            finished: game.finished,
            winner: game.winner,
            widgetThrows: game.currentThrows.slice(0)
          });
        }
      } else {
        game.currentPlayer = players.order[game.playerOffset];
      }

      if (playerChanged) {
        game.roundBeginningScore = game.players[game.currentPlayer].score;
        game.players[game.currentPlayer].history[game.currentRound] = [];
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
        widgetThrows: game.currentThrows.slice(0)
      });
    }
    return state;
  }
};