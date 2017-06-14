'use strict';
import fetch from 'isomorphic-fetch';

/**
 * Action types
 */
export const GAME_FETCH_LIST_START = 'GAME_FETCH_LIST_START';
export const GAME_FETCH_LIST_COMPLETE = 'GAME_FETCH_LIST_COMPLETE';
export const GAME_SELECT_NAME = 'GAME_SELECT_NAME';
export const GAME_SELECT_VARIATION = 'GAME_SELECT_VARIATION';
//export const GAME_SELECT_MODIFIERS = 'GAME_SELECT_MODIFIERS';
export const GAME_CREATE_START = 'GAME_CREATE_START';
export const GAME_CREATE_COMPLETE = 'GAME_CREATE_COMPLETE';


/**
 * List of throw types
 */


/**
 * ACTIONS
 */
export function showGamesList() {
  return (dispatch, getState) => {
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
  return {type: GAME_FETCH_LIST_START};
}

export function fetchGameListComplete(response) {
  return {type: GAME_FETCH_LIST_COMPLETE, response};
}


export function createGame() {
  return (dispatch, getState) => {
    let newGame = getState();

    if (newGame.options.name) {
      dispatch(createGameStart());

      return fetch('/api/gamecreate', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(newGame.options)
      })
        // @todo: add .catch() for error handling
      .then(response =>  response.json())
      .then(json => dispatch(createGameComplete(json)));
    }
  };
}

export function createGameStart() {
  return {type: GAME_CREATE_START};
}

export function createGameComplete(response) {
  return {type: GAME_CREATE_COMPLETE, response};
}