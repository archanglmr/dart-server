'use strict';



/**
 * Action types
 */
const INIT = 'INIT';
const UPDATE_PLAYER_INFO = 'UPDATE_PLAYER_INFO';


module.exports.INIT = INIT;
module.exports.UPDATE_PLAYER_INFO = UPDATE_PLAYER_INFO;


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