'use strict';



/**
 * Action types
 */
const INIT = 'INIT';
const UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO';
const PROCESS_THROW = 'PROCESS_THROW';
const UNDO_THROW = 'UNDO_THROW';


module.exports.INIT = INIT;
module.exports.UPDATE_PLAYER_INFO = UPDATE_PLAYER_INFO;
module.exports.PROCESS_THROW = PROCESS_THROW;
module.exports.UNDO_THROW = UNDO_THROW;


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
 * Process a throw
 *
 * @param throwData
 * @returns {{type: string, throwData: *}}
 */
module.exports.throwDart = function(throwData) {
  return {type: PROCESS_THROW, throwData};
};

/**
 * Undo a throw
 *
 * @returns {{type: string}}
 */
module.exports.undoThrow = function() {
  return {type: UNDO_THROW};
};