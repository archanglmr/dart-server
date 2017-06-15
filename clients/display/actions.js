'use strict';
/**
 * Note: We need to use 'module.exports' instead of 'export' because this file
 * gets included by the GameManager which is Node es2016 not standard es2016.
 */
/**
 * Action types
 */

// for gameDisplayClientRootReducer()
const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE'; //doubles as server message
module.exports.UPDATE_GAME_STATE = UPDATE_GAME_STATE;


// for gameDisplayContainerRootReducer()
const UPDATE_DISPLAY_URL = 'UPDATE_DISPLAY_URL';
const CLIENT_LOADED = 'CLIENT_LOADED';
const GAME_MENU_VISIBILITY = 'GAME_MENU_VISIBILITY';

module.exports.UPDATE_DISPLAY_URL = UPDATE_DISPLAY_URL; //doubles as server message
module.exports.CLIENT_LOADED = CLIENT_LOADED;
module.exports.GAME_MENU_VISIBILITY = GAME_MENU_VISIBILITY; //doubles as server message




/**
 * ACTIONS
 */

// for gameDisplayClientRootReducer()
/**
 * Dispatchable action for updating the game state (this comes from the server)
 *
 * @param state A whole new game state
 * @returns {{type: string, state: *}}
 */
module.exports.updateGameState = function updateGameState(state) {
  return {type: UPDATE_GAME_STATE, state};
};



// for gameDisplayContainerRootReducer()
module.exports.updateDisplayUrl = function updteDisplayUrl(url) {
  return {type: UPDATE_DISPLAY_URL, url};
};
module.exports.clientLoaded = function clientLoaded(url) {
  return {type: CLIENT_LOADED};
};
module.exports.gameMenuVisibility = function gameMenuVisibility(show) {
  return {type: GAME_MENU_VISIBILITY, show};
};