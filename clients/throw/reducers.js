'use strict';

import {combineReducers} from 'redux'


import throwStateReducer from './reducer-throw-state';
import newGameReducer from './reducer-new-game';
import {UPDATE_GAME_STATE} from '../display/actions';


export const rootReducer = combineReducers({
  throwState: throwStateReducer,
  newGame: newGameReducer
});



/**
 * The "Root Reducer" for the game client
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export function gameRootReducer(state, action = {}) {
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