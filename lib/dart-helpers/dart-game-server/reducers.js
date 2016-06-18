'use strict';

var initialState = require('./initial-state'),
    actions = require('./actions');

/**
 * Root Reducer for all game servers. This allows us to do some boilerplate
 * stuff
 *
 * @param {{object}} state
 * @param {{type: string}} action
 * @returns {*}
 */
module.exports = function rootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  switch(action.type) {
    case actions.INIT:
        let {variation, modifiers, players, playerOrder} = action.config,
            newState = Object.assign({}, state, {
              config: {
                variation,
                modifiers
              },
              players: {
                current: playerOrder[0],
                order: playerOrder,
                data: players
              }
            });

        if (this.actionInit) {
          newState = this.actionInit(newState);
        }

        return Object.assign({}, newState);

    case action.UPDATE_PLAYER_INFO:
        action.playerInfo
      break;

    default:
      return state;
  }

  return state;
};