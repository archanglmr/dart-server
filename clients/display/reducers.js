'use strict';

import { UPDATE_GAME_STATE, UPDATE_DISPLAY_URL } from './actions';

const initialState = {};


/**
 * The "Root Reducer" for the game client
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function clientRootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  switch(action.type) {
    case UPDATE_GAME_STATE:
      if (action.state) {
        return action.state;
      }
      break;

    default:
      return state;
  }
  return state;
}



/**
 * The "Root Reducer" for the display controlling the game client
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function displayRootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return {display: false};
  }

  switch(action.type) {
    case UPDATE_DISPLAY_URL:
      if (action.url) {
        return Object.assign({}, state, {display: action.url});
      }
      break;

    default:
      return state;
  }
  return state;
}