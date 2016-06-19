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
}

module.exports = State;