'use strict';
import fetch from 'isomorphic-fetch';

/**
 * Action types
 */
export const GAME_LIST_START = 'GAME_LIST_START';
export const GAME_LIST_COMPLETE = 'GAME_LIST_COMPLETE';
export const GAME_CREATE_START = 'GAME_CREATE_START';
export const GAME_CREATE_COMPLETE = 'GAME_CREATE_COMPLETE';
export const GAME_SELECT_NAME = 'GAME_SELECT_NAME';
export const GAME_SELECT_VARIATION = 'GAME_SELECT_VARIATION';
export const GAME_SELECT_MODIFIERS = 'GAME_SELECT_MODIFIERS';


/**
 * List of throw types
 */


/**
 * ACTIONS
 */
export function showGamesList() {
  return (dispatch, getState) => {
    let state = getState();

    dispatch(fetchGameList());

    return fetch('/api/gameoptions', {
      method: 'get'
    })
      // @todo: add .catch() for error handling
        .then(response =>  response.json())
        .then(json => dispatch(fetchGameListComplete(json)));
  };
}

export function fetchGameList() {
  return {type: GAME_LIST_START};
}

export function fetchGameListComplete(response) {
  return {type: GAME_LIST_COMPLETE, response};
}