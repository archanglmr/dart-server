'use strict';
import {
    GAME_LIST_START,
    GAME_LIST_COMPLETE,
    GAME_CREATE_START,
    GAME_CREATE_COMPLETE,
    GAME_SELECT_NAME,
    GAME_SELECT_VARIATION,
    GAME_SELECT_MODIFIERS,
} from './actions-new-game';

const initialState = {
  showClient: false,
  list: {},
  options: {
    name: '',
    variation: ''
  },
  player: {}
};


/**
 * The "Root Reducer" for the new game client
 *
 * @param newGame {{showClient: bool, list: Object, options: Object, players: Object}}
 * @param action {{type: string}}
 * @returns {{showClient: bool, list: Object, options: Object, players: Object}}
 */
export default function newGameReducer(newGame, action = {}) {
  if ('undefined' === typeof newGame) {
    return initialState;
  }
  return newGame;
}