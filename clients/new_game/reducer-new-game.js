'use strict';
import {
    GAME_FETCH_LIST_START,
    GAME_FETCH_LIST_COMPLETE,
    GAME_SELECT_NAME,
    GAME_SELECT_VARIATION,
    //GAME_SELECT_MODIFIERS,
    GAME_CREATE_START,
    GAME_CREATE_COMPLETE
} from './actions-new-game';

const initialState = {
  showClient: false,
  loading: false,
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
  var gameState, options;
  switch(action.type) {
    case GAME_FETCH_LIST_START:
      gameState = {
        showClient: true,
        loading: true
      };
      return Object.assign({}, newGame, gameState);

    case GAME_FETCH_LIST_COMPLETE:
      gameState = {
        loading: false,
        list: action.response.games,
        player: action.response.player
      };

      return Object.assign({}, newGame, gameState);

    case GAME_SELECT_NAME:
      options = Object.assign({}, newGame.options);
      if (newGame.list.hasOwnProperty(action.name)) {
        options.name = action.name;
        return Object.assign({}, newGame, {options});
      }
      break;

    case GAME_SELECT_VARIATION:
      options = Object.assign({}, newGame.options);
      let variations = newGame.list[options.name].variations;
      if (options.name && variations && variations.hasOwnPropery(action.variation)) {
        options.variation = action.variation;
        return Object.assign({}, newGame, {options});
      }
      break;

    //case GAME_SELECT_MODIFIERS:
    //  break;

    case GAME_CREATE_START:
      gameState = {
        loading: true
      };
      return Object.assign({}, newGame, gameState);

    case GAME_CREATE_COMPLETE:
        //action.response;
      gameState = {
        showClient: false,
        loading: false
      };
      return Object.assign({}, newGame, gameState);
  }
  return newGame;
}