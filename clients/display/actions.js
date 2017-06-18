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
const UPDATE_GAME_MENU = 'UPDATE_GAME_MENU';

const GAME_MENU_KEY_PREVIOUS = 'GAME_MENU_KEY_PREVIOUS';
const GAME_MENU_KEY_NEXT = 'GAME_MENU_KEY_NEXT';
const GAME_MENU_KEY_PARENT = 'GAME_MENU_KEY_PARENT';
const GAME_MENU_KEY_CHILD = 'GAME_MENU_KEY_CHILD';

const GAME_ACTION_UNTHROW = 'GAME_ACTION_UNTHROW';
const GAME_ACTION_REPLAY = 'GAME_ACTION_REPLAY';
const GAME_ACTION_END_GAME = 'GAME_ACTION_END_GAME';
const GAME_ACTION_RETURN_TO_GAME = 'GAME_ACTION_RETURN_TO_GAME';


module.exports.UPDATE_DISPLAY_URL = UPDATE_DISPLAY_URL; //doubles as server message
module.exports.CLIENT_LOADED = CLIENT_LOADED;
module.exports.UPDATE_GAME_MENU = UPDATE_GAME_MENU; //doubles as server message

module.exports.GAME_MENU_KEY_PREVIOUS = GAME_MENU_KEY_PREVIOUS;
module.exports.GAME_MENU_KEY_NEXT = GAME_MENU_KEY_NEXT;
module.exports.GAME_MENU_KEY_PARENT = GAME_MENU_KEY_PARENT;
module.exports.GAME_MENU_KEY_CHILD = GAME_MENU_KEY_CHILD;

module.exports.GAME_ACTION_UNTHROW = GAME_ACTION_UNTHROW;
module.exports.GAME_ACTION_REPLAY = GAME_ACTION_REPLAY;
module.exports.GAME_ACTION_END_GAME = GAME_ACTION_END_GAME;
module.exports.GAME_ACTION_RETURN_TO_GAME = GAME_ACTION_RETURN_TO_GAME;




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
module.exports.updateDisplayUrl = function updateDisplayUrl(url) {
  return {type: UPDATE_DISPLAY_URL, url};
};
module.exports.clientLoaded = function clientLoaded(url) {
  return {type: CLIENT_LOADED};
};
module.exports.updateGameMenu = function updateGameMenu(data) {
  return {type: UPDATE_GAME_MENU, data};
};