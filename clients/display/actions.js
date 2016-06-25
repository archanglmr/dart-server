'use strict';

/**
 * Action types
 */
const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE';

module.exports.UPDATE_GAME_STATE = UPDATE_GAME_STATE;

/**
 * ACTIONS
 */

/**
 * Dispatchable action for updating the game state (this comes from the server)
 *
 * @param state A whole new game state
 * @returns {{type: string, state: *}}
 */
module.exports.updateGameState = function updateGameState(state) {
  return {type: UPDATE_GAME_STATE, state};
};