'use strict';

import { UPDATE_GAME_STATE, UPDATE_DISPLAY_URL, CLIENT_LOADED, GAME_MENU_VISIBILITY } from './actions';

/**
 * The "Root Reducer" for the game client
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function gameDisplayClientRootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return {};
  }

  switch(action.type) {
    case UPDATE_GAME_STATE:
      if (action.state) {
        return action.state;
      }
      break;

    default:
      break;
  }
  return state;
}



/**
 * The "Root Reducer" for the display container controlling the game client
 * (display)
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function gameDisplayContainerRootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return {loading: true, display: false, showGameMenu: false};
  }

  switch(action.type) {
    case UPDATE_DISPLAY_URL:
      if (action.url) {
        return Object.assign({}, state, {loading: true, display: action.url});
      }
      break;

    case CLIENT_LOADED:
      return Object.assign({}, state, {loading: false});

    case GAME_MENU_VISIBILITY:
      return Object.assign({}, state, {showGameMenu: action.show});

    default:
      break;
  }
  return state;
}