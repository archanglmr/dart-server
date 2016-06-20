'use strict';
var DartHelpers = require('../../../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;

module.exports = class DartGameServer_01 extends DartHelpers.DartGameServer {
  /**
   * Gets the display name for this game type/variation
   *
   * @returns {string}
   */
  getDisplayName() {
    return this.getState().config.variation;
  }


  /**
   * Pretty much just for the command line to see the score after a throw.
   *
   * @returns {*|game|newState.game|{tempScore, players}|boolean|module.exports.game}
   */
  getScores() {
    var state = this.getState(),
        player = DartHelpers.State.getPlayer(state, state.players.current),
        lines = [];

    lines.push('----------------------------------------');
    lines.push(
        `${player.displayName} is on ` +
        `${state.game.currentThrow + 1} of ${state.rounds.throws} throws ` +
        `round ${state.rounds.current} of ${state.rounds.limit} with a round score of ${state.game.tempScore}`);
    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i],
          player = DartHelpers.State.getPlayer(state, id);

      lines.push(
          (state.players.current === id ? ' > ' : ' - ') +
          `${player.displayName}: ${state.game.players[id].score}`
      );
    }
    //lines.push('----------------------------------------');
    lines.push("");
    lines.push("");

    return lines.join("\n");
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



  /*****************************************************************************
   * HOOKS FOR DEFAULT ACTIONS
   ****************************************************************************/
  /**
   * Start the game (init is handled by the system).
   *
   * @param state {object}
   * @returns {object} game state
   */
  actionStartGame(state) {
    if (!state.game.started) {
      //init the actual game

      // shallow clone stuff
      let newState = Object.assign({}, state),
          game = Object.assign({}, state.game),
          players = Object.assign({}, state.players);

      game.playerOffset = 0;
      game.currentPlayer = state.players.order[game.playerOffset];
      game.currentRound = 0;
      game.currentThrow = 0;

      game.tempScore = 0;
      game.roundBeginningScore = state.game.players[game.currentPlayer].score;

      game.started = true;
      game.finished = false;
      game.locked = false;

      // advance the global state
      players.current = game.currentPlayer;

      // rebuild the new state
      return Object.assign(newState, {game, players});
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
    if (
        state.game.started &&
        !state.game.finished &&
        !state.game.locked &&
        DartHelpers.State.validRound(state.rounds)
    ) {
      // we're in a valid round

      // shallow clone stuff
      let newState = Object.assign({}, state),
          game = Object.assign({}, state.game),
          players = Object.assign({}, state.players);


      game.tempScore += this.calculateThrowDataValue(throwData);

      // @todo: check to make sure assigning game.players[x].score is safe
      let score = game.players[game.currentPlayer].score = (game.roundBeginningScore - game.tempScore);
      if (score < 0) {
        console.log('BUST');
      } else if (0 === score) {
        game.finished = true;
        console.log('WINNER');
      }

      game.locked = true;

      // rebuild the new state
      return Object.assign(newState, {game, players});
    }
    return state;
  }


  actionAdvanceGame(state) {
    // @todo implement game advancement here
    if (
        state.game.started &&
        !state.game.finished &&
        state.game.locked &&
        DartHelpers.State.validRound(state.rounds)
    ) {
      // we're in a valid round

      // shallow clone stuff
      let newState = Object.assign({}, state),
          game = Object.assign({}, state.game),
          players = Object.assign({}, state.players),
          rounds = Object.assign({}, state.rounds);


      //// Process BUST
      //if (game.players[game.currentPlayer].score < 0) {
      //  game.players[game.currentPlayer].score = game.roundBeginningScore;
      //}

      // advance the game
      game.currentThrow += 1;
      if (game.currentThrow >= rounds.throws) {
        // next player
        game.currentThrow = 0;
        game.tempScore = 0;
        game.playerOffset += 1;
      }

      if (game.playerOffset >= players.order.length) {
        // @todo: test if last round?

        // next round actually
        game.playerOffset = 0;
        game.currentRound += 1;

        if (rounds.limit && game.currentRound >= rounds.limit) {
          game.finished = true;
          console.log('Out of rounds');
          return Object.assign(newState, {game, players, rounds});
        }
      }

      game.currentPlayer = players.order[game.playerOffset];
      game.tempScore = 0;
      // beginning score are calculated when a player is on the first throw
      game.roundBeginningScore = game.players[game.currentPlayer].score;

      game.locked = false;

      // advance the global state
      players.current = game.currentPlayer;
      rounds.current = game.currentRound;

      // rebuild the new state
      return Object.assign(newState, {game, players, rounds});
    }
    return state;
  }


  /**
   * After the init is run this will modify the state per the config and return
   * the new full state.
   *
   * @param {object} state
   * @returns {*}
   */
  actionInit(state) {
    let {variation, modifiers} = state.config,
        // cloning the part we need because we're going to overwrite stuff
        newState = {
          rounds: Object.assign({}, state.rounds),
          game: {
            tempScore: 0,
            players: {}
          }
        };

    if (modifiers.limit) {
      newState.rounds.limit = modifiers.limit;
    }

    for (let i = 0, c = state.players.order.length; i < c; i += 1) {
      let id = state.players.order[i];

      newState.game.players[id] = {
        id,
        score: parseInt(state.config.variation, 10)
      };
    }

    return Object.assign({}, state, newState);
  }
};