'use strict';

import { UPDATE_GAME_STATE } from './actions';

const initialState = {};


/**
 * The "Root Reducer" for the client
 *
 * @param state {object}
 * @param action {{type: string}}
 * @returns {object}
 */
export default function rootReducer(state, action = {}) {
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