'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    FilterTypes = DartHelpers.State.FilterTypes;

module.exports = class DartGameServer_Cricket extends DartHelpers.DartGameServer {
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
    var state = this.getState(),
        name = state.game.label || state.config.variation || 'standard',
        filter = this.getFilter(),
        modifiers = [];

    if (filter) {
      modifiers.push(`[${DartHelpers.State.getFilterName(filter)}]`);
    }

    return name.substr(0, 1).toUpperCase() + name.substr(1) + ' Cricket' + (modifiers.length ? (' ' + modifiers.join(' ')) : '');
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

    if (this.isNumberInGame(number)) {
      data.value = 21 === number ? 25 : number;

      if (25 === data.value) {
        if (ThrowTypes.DOUBLE === throwData.type) {
          data.marks = 2;
        } else if (ThrowTypes.SINGLE_OUTER) {
          data.marks = 1;
        }
      } else if (this.isFilteredThrow(throwData)) {
        switch(throwData.type) {
          case ThrowTypes.TRIPLE:
            if (25 !== data.value) {
              data.marks = 3;
            }
            break;

          case ThrowTypes.DOUBLE:
            data.marks = 2;
            break;

          case ThrowTypes.SINGLE_INNER:
          case ThrowTypes.SINGLE_OUTER:
            data.marks = 1;
            break;
        }
      }
    }
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
    if (1 === state.players.order.length && !this.isCloseout()) {
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

  /**
   * Checks to see if this is a "Closeout" game.
   *
   * @returns {boolean}
   */
  isCloseout() {
    if (undefined === this.closeout) {
      this.closeout = 'Closeout' === this.getState().config.variation;
    }
    return this.closeout;
  }

  /**
   * Checks the current throws with earnedMarks for Hat Trick awards.
   *
   * @param currentThrows {Array}
   * @param earnedMarks {Array}
   * @returns {*}
   */
  checkForHatTrickNotifications(currentThrows, earnedMarks) {
    if (currentThrows.length >= 3 && earnedMarks.length >= 3) {
      let hatTrick = true,
          threeInTheBlack = true;

      for (let i = 0, c = currentThrows.length; i < c; i += 1) {
        let throwData = currentThrows[i],
            throwMarks = earnedMarks[i];
        if (21 === throwData.number && throwMarks) {
          if (1 === throwMarks || ThrowTypes.DOUBLE !== throwData.type) {
            threeInTheBlack = false;
          }
        } else {
          hatTrick = false;
          threeInTheBlack = false;
        }
      }

      if (threeInTheBlack) {
        return [{type: 'three_in_black'}];
      } else if (hatTrick) {
        return [{type: 'hat_trick'}];
      }
    }
    return false;
  }

  /**
   * Checks the current throws with highlightMarks for a White Horse (3 unique
   * virgin triples).
   *
   * @param currentThrows {Array}
   * @param highlightMarks {Object}
   * @returns {*}
   */
  checkForWhiteHorseNotification(currentThrows, highlightMarks) {
    if (currentThrows.length >= 3) {
      let whiteHorse = true,
          throwNumbers = [];

      for (let i = 0, c = currentThrows.length; i < c; i += 1) {
        let throwData = currentThrows[i],
            throwMarks = highlightMarks[throwData.number];

        if (-1 === throwNumbers.indexOf(throwData.number) && throwMarks >= 3) {
          //yes
          throwNumbers.push(throwData.number);
        } else {
          whiteHorse = false;
        }
      }

      if (whiteHorse) {
        return [{type: 'white_horse'}];
      }
    }
    return false;
  }

  /**
   * Checks the current throws with earnedMarks for various awards.
   *
   * @param currentThrows {Array}
   * @param earnedMarks {Array}
   * @returns {*}
   */
  checkForThreeInBedNotification(currentThrows, earnedMarks) {
    if (currentThrows.length >= 3 && earnedMarks.length >= 3 && earnedMarks[0]) {
      let threeInBed = true,
          ref = currentThrows[0];

      if (ThrowTypes.DOUBLE === ref.type || ThrowTypes.TRIPLE === ref.type) {
        for (let i = 1, c = currentThrows.length; i < c; i += 1) {
          let current = currentThrows[i];
          if (current.type !== ref.type || current.number !== ref.number) {
            threeInBed = false;
          }
        }
      } else {
        threeInBed = false;
      }

      if (threeInBed) {
        return [{type: 'three_in_bed'}];
      }
    }
    return false;
  }

  /**
   * Checks the current throws with earnedMarks for "X Mark" notifications (5-9
   * Mark awards).
   *
   * @param earnedMarks {Array}
   * @returns {*}
   */
  checkForXMarksNotifications(earnedMarks) {
    if (earnedMarks.length >= 3) {
      let marks = 0;

      for (let i = 0, c = earnedMarks.length; i < c; i += 1) {
        marks += earnedMarks[i];
      }

      if (marks >= 5) {
        return [{type: 'marks', data: marks}];
      }
    }
    return false;
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
    var targets = Object.assign({}, game.targets),
      dartboard = {
          visible: false,
          highlight: {}
        };

    if (this.isCloseout()) {
      let currentPlayerMarks = game.players[currentPlayerId].marks;
      for (let mark in currentPlayerMarks) {
        if (currentPlayerMarks.hasOwnProperty(mark)) {
          targets[mark] = (currentPlayerMarks[mark] < 3);
        }
      }
    }

    for (let number in targets) {
      if (targets.hasOwnProperty(number) && targets[number]) {
        let single_outer = {number, type: ThrowTypes.SINGLE_OUTER},
            single_inner = {number, type: ThrowTypes.SINGLE_INNER},
            double = {number, type: ThrowTypes.DOUBLE},
            triple = {number, type: ThrowTypes.TRIPLE};

        dartboard.visible = true;
        dartboard.highlight[number] = [];

        if (21 === parseInt(number)) {
          dartboard.highlight[number].push(single_outer);
          dartboard.highlight[number].push(double);
        } else {
          if (this.isFilteredThrow(single_outer)) {
            dartboard.highlight[number].push(single_outer);
          }
          if (this.isFilteredThrow(single_inner)) {
            dartboard.highlight[number].push(single_inner);
          }
          if (this.isFilteredThrow(double)) {
            dartboard.highlight[number].push(double);
          }
          if (this.isFilteredThrow(triple)) {
            dartboard.highlight[number].push(triple);
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
    // cloning the part we need because we're going to overwrite stuff
    var config = Object.assign({}, state.config),
        game = {
          tempScore: 0,
          players: {},
          currentThrows: [],
          roundOver: false,
          // true means open, false means closed
          targets: {20: true, 19: true, 18: true, 17: true, 16: true, 15: true, 21: true}
        },
        rounds = Object.assign({}, state.rounds),
        marks = {};

    // init the marks for this game
    for (let target in game.targets) {
      if (game.targets.hasOwnProperty(target)) {
        marks[target] = 0;
      }
    }

    if (config.modifiers) {
      if (config.modifiers.hasOwnProperty('limit')) {
        rounds.limit = state.config.modifiers.limit;
      }
      if (config.modifiers.hasOwnProperty('filter')) {
        if (!DartHelpers.State.isFilterAllowed(config.modifiers.filter, this.listFiltersAllowed())) {
          delete config.modifiers.filter;
        }
      }
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        marks: Object.assign({}, marks),
        highlightMarks: {},
        history: [[]],
        earnedMarks: [[]],
        throwHistory: []
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
          currentPlayer = game.players[players.current],
          notificationQueue = [{type: 'throw', data: {type: ThrowTypes.MISS, number: 0}}],
          finished = state.finished,
          winner = state.winner;

      game.roundOver = false;
      game.currentThrows.push(throwData);
      rounds.currentThrow += 1;
      game.roundOver = (rounds.currentThrow >= rounds.throws);

      // set the temp score as in the player score history
      currentPlayer.throwHistory.push(throwData);

      if (this.isNumberOpen(throwData.number)) {
        // process only if the number is open
        let throwStats = this.calculateThrowDataValue(throwData),
            currentMarks = currentPlayer.marks[throwData.number],
            neededMarks = Math.max(0, (3 - currentMarks)),

            // give marks
            closingMarks = Math.min(neededMarks, throwStats.marks), // these marks are toward closing out
            excessMarks = throwStats.marks - closingMarks, // these marks are worth points
            earnedMarks = closingMarks; // May add the excess marks if the number is still open

        currentPlayer.marks[throwData.number] += closingMarks;
        currentPlayer.highlightMarks[throwData.number] = (currentPlayer.highlightMarks[throwData.number] || 0) + closingMarks;
        currentPlayer.history[rounds.current].push(closingMarks);
        if (closingMarks || excessMarks) {
          notificationQueue = [{type: 'throw', data: throwData}];
        }

        // check to see if this closes the number globally and assign the value
        if ((game.targets[throwData.number] = this.isNumberOpenInPlayers(throwData.number))) {
          // give points if allowed
          if (!this.isCloseout()) {
            let points = excessMarks * throwStats.value;

            currentPlayer.marks[throwData.number] += excessMarks;
            game.tempScore += points;
            currentPlayer.score += points;

            earnedMarks += excessMarks;
          }
        }

        if (this.isCloseout()) {
          if (closingMarks && currentPlayer.marks[throwData.number] >= 3) {
            game.tempScore += 1;
            currentPlayer.score += 1;
          }
        }
        currentPlayer.earnedMarks[rounds.current].push(earnedMarks);


        if (game.roundOver) {
          notificationQueue = notificationQueue.concat(this.checkForTonNotifications(game.tempScore) || []);
          notificationQueue = notificationQueue.concat(
              this.checkForHatTrickNotifications(game.currentThrows, currentPlayer.earnedMarks[rounds.current]) ||
              this.checkForWhiteHorseNotification(game.currentThrows, currentPlayer.highlightMarks) ||
              this.checkForThreeInBedNotification(game.currentThrows, currentPlayer.earnedMarks[rounds.current]) ||
              this.checkForXMarksNotifications(currentPlayer.earnedMarks[rounds.current]) ||
              []
          );
        }

        // check win condition
        if (
          this.areAllMarksClosed(currentPlayer.marks) &&
          (
              this.isCloseout() ||
              (currentPlayer.score >= this.getHighestScore(game.players, players.current))
          )
        ) {
          finished = true;
          winner = currentPlayer.id;
          notificationQueue.push(this.buildWinnerNotification(winner));
        }
      } else {
        currentPlayer.history[rounds.current].push(0);
        currentPlayer.earnedMarks[rounds.current].push(0);
      }

      game.players[players.current] = currentPlayer;




      if (game.roundOver && !winner) {
        notificationQueue.push({type: 'remove_darts'});
      }

      // rebuild the new state
      // rebuild the new state
      return Object.assign({}, state, {
        game,
        rounds,
        widgetThrows: game.currentThrows.slice(0),
        locked: !winner, // by not locking we can undo
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
        game.players[players.current].highlightMarks = {};
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
        game.players[players.current].history[rounds.current] = [];
        game.players[players.current].earnedMarks[rounds.current] = [];
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