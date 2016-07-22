'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes,
    WindicatorOpponentPlugin = require('../../01/server/WindicatorOpponentPlugin'),
    WindicatorPlugin = require('../../01/server/WindicatorPlugin'),
    Windicator = require('../../01/server/Windicator');

module.exports = class DartGameServer_Gotcha extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    return  super.getDisplayName() + '!';
  }


  /**
   * Calculates the value in this game of the current throw.
   *
   * @param throwData {{type: string, number: number}}
   * @returns {number}
   */
  calculateThrowDataValue(throwData) {
    var value = throwData.number;

    /* accounts for the bull */
    if (21 === value) {
      value = 25;
    }

    switch(throwData.type) {
      case ThrowTypes.TRIPLE:
        if (25 !== value) {
          value *= 3;
        }
        break;
      case ThrowTypes.DOUBLE:
        /*
         if you wanted different rules for double bull this is the place to
         put them
         */
        value *= 2;
        break;

      case ThrowTypes.MISS:
      case ThrowTypes.SINGLE_INNER:
      case ThrowTypes.SINGLE_OUTER:
        break;
    }
    return value;
  }

  /**
   * Checks all the players and resets their score to 0 if they have the same
   * score as the current player.
   *
   * @param currentPlayerId {number}
   * @param players
   * @returns {object}
   */
   bombOtherPlayers(currentPlayerId, players) {
    var bombScore = players[currentPlayerId].score;

    for (let id in players) {
      if (players.hasOwnProperty(id)) {
        if (players[id].id !== currentPlayerId && players[id].score === bombScore) {
          players[id].score = 0;
        }
      }
    }
    return players;
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
    var config = Object.assign({}, state.config),
    // cloning the part we need because we're going to overwrite stuff
        game = {
          started: state.started,
          locked: state.locked,
          finished: state.finished,
          winner: state.winner,
          tempScore: 0,
          players: {},
          rounds: Object.assign({}, state.rounds),
          roundOver: false
        };

    //this.registerPlugin(new Windicator(this.calculateThrowDataValue, config.extras));
    this.registerPlugin(new WindicatorPlugin(new Windicator(this.calculateThrowDataValue, config.extras), (state) => 301 - state.game.players[state.game.currentPlayer].score));
    this.registerPlugin(new WindicatorOpponentPlugin(new Windicator(this.calculateThrowDataValue, config.extras)));

    if (config.modifiers && config.modifiers.limit) {
      game.rounds.limit = config.modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      game.players[id] = {
        id,
        score: 0,
        history: [0],
        throwHistory: []
      };
    }

    return Object.assign({}, state, {game, rounds: Object.assign({}, game.rounds), config});
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

      game.widgetWindicator = [];
      game.opponentWindicators = [];

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

      let score = game.players[game.currentPlayer].score = (game.roundBeginningScore + game.tempScore);
      // set the temp score as in the player score history
      game.players[game.currentPlayer].history[game.rounds.current] = game.tempScore;
      game.players[game.currentPlayer].throwHistory.push(throwData);
      if (301 === score) {
        game.finished = true;
        game.winner = game.currentPlayer;
        console.log('WINNER');
      }

      game.locked = true;



      // Process BUST or advance round
      game.roundOver = ((score > 301) || ((game.currentThrow + 1) >= game.rounds.throws));

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


      // Process BUST
      if (game.players[game.currentPlayer].score > 301) {
        // advance from a bust
        game.players[game.currentPlayer].score = game.roundBeginningScore;
        game.players[game.currentPlayer].history[game.rounds.current] = 0;

        game.currentThrow = 0;
        game.tempScore = 0;
        game.playerOffset += 1;
        playerChanged = true;

        game.currentThrows = [];
      } else {
        // advance the game normally
        game.currentThrow += 1;

        // check for bombs
        this.bombOtherPlayers(game.currentPlayer, game.players);


        if (game.currentThrow >= game.rounds.throws) {
          // next player
          game.currentThrow = 0;
          game.tempScore = 0;
          game.playerOffset += 1;
          playerChanged = true;

          game.currentThrows = [];
        }
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
