'use strict';



/**
 * Action types
 */
const INIT = 'INIT';
const UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO';
const START_GAME = 'START_GAME';
const PROCESS_THROW = 'PROCESS_THROW';
const UNDO_THROW = 'UNDO_THROW';
const ADVANCE_GAME = 'ADVANCE_GAME';
const DART_SERVER_PLUGIN = 'DART_SERVER_PLUGIN';


module.exports.INIT = INIT;
module.exports.UPDATE_PLAYER_INFO = UPDATE_PLAYER_INFO;
module.exports.START_GAME = START_GAME;
module.exports.PROCESS_THROW = PROCESS_THROW;
module.exports.UNDO_THROW = UNDO_THROW;
module.exports.ADVANCE_GAME = ADVANCE_GAME;
module.exports.DART_SERVER_PLUGIN = DART_SERVER_PLUGIN;


/**
 * ACTIONS
 */

/**
 * Used to set the initial config
 *
 * @param config
 * @returns {{type: string, config: *}}
 */
module.exports.init = function init(config) {
  return {type: INIT, config};
};

/**
 * Used when the player info changes (such as name)
 *
 * @param playerInfo
 * @returns {{type: string, playerInfo: *}}
 */
module.exports.updatePlayerInfo = function updatePlayerInfo(playerInfo) {
  return {type: UPDATE_PLAYER_INFO, playerInfo};
};

/**
 * Action to start a game (init is for processing the config, start if for
 * beginning the game.
 *
 * @returns {{type: string}}
 */
module.exports.startGame = function startGame() {
  return {type: START_GAME};
};

/**
 * Process a throw
 *
 * @param throwData
 * @returns {{type: string, throwData: *}}
 */
module.exports.throwDart = function throwDart(throwData) {
  return {type: PROCESS_THROW, throwData};
};

/**
 * Undo a throw
 *
 * @param state
 * @returns {{type: string}}
 */
module.exports.undoThrow = function undoThrow(state) {
  return {type: UNDO_THROW, state};
};

/**
 * Advances the game. A game should look at the state and decide the setup for
 * the next round.
 *
 * @returns {{type: string}}
 */
module.exports.advanceGame = function advanceGame() {
  return {type: ADVANCE_GAME};
};

/**
 * Wrapper for the dart server plugin
 *
 * @param customReducer {function({object} state)}
 * @returns {{type: string}}
 */
module.exports.dartServerPlugin = function dartServerPlugin(customReducer) {
  return {type: DART_SERVER_PLUGIN, customReducer};
};