'use strict';

import {combineReducers} from 'redux'


import throwStateReducer from './reducer-throw-state';
import {UPDATE_GAME_STATE} from '../display/actions';


/**
 * This makes it so the the throwClientRootReducer only cares about the
 * throwState
 */
export const throwClientRootReducer = combineReducers({
  throwState: throwStateReducer
});



/**
 * The "Root Reducer" for the game display client. This allows us to use game
 * display components in the throw client. We only care about the updated game
 * state action.
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function gameDisplayRootReducer(state, action = {}) {
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