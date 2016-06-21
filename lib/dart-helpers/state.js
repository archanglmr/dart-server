'use strict';

class State {
  /**
   * Gets the player info object from the game state.
   *
   * @param state
   * @param id
   * @returns {*|bool}
   */
  static getPlayer(state, id) {
    if (state.players && state.players.data && state.players.data[id]) {
      return state.players.data[id];
    }
    return false;
  }

  /**
   * Checks the global/common state to make sure the game is in play and a valid
   * round. This does not check if the game is locked.
   *
   * @param state
   * @returns {boolean}
   */
  static isPlayable(state) {
    return State.inPlay(state) && State.validRound(state.rounds);
  }

  /**
   * Checks the global/common game state to make sure the game is in play
   *
   * @param state {object}
   * @returns {boolean}
   */
  static inPlay(state) {
    return state.started && !state.finished;
  }

  /**
   * Checks the rounds part of the games State to make sure it's a valid round
   *
   * @param rounds {object}
   * @returns {boolean}
   */
  static validRound(rounds) {
    return !rounds.limit || (rounds.current < rounds.limit);
  }
}

module.exports = State;