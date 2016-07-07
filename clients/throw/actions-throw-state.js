'use strict';
import fetch from 'isomorphic-fetch';
import ThrowTypes from '../../lib/throw-types.js';

/**
 * Action types
 */
export const SELECT_THROW_TYPE = 'SELECT_THROW_TYPE';
export const SELECT_THROW_NUMBER = 'SELECT_THROW_NUMBER';
export const SUBMIT_THROW_START = 'SUBMIT_THROW_START';
export const SUBMIT_THROW_COMPLETE = 'SUBMIT_THROW_COMPLETE';

export const SUBMIT_UNDO_START = 'SUBMIT_UNDO_START';
export const SUBMIT_UNDO_COMPLETE = 'SUBMIT_UNDO_COMPLETE';


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
export const ThrowTypesList = ThrowTypes;


var autoSubmit = (window.location.search && window.location.search.match(/autosubmit/).length);
/**
 * ACTIONS
 */

/**
 * Dispatchable action for selecting the type of throw.
 *
 * @param throwType key from the ThrowTypesList constant
 * @returns {{type: string, throwType: *}}
 */
export function selectThrowType(throwType) {
  if (autoSubmit) {
    return (dispatch, getState) => {
      dispatch({type: SELECT_THROW_TYPE, throwType});
      dispatch(submitThrow());
    };
  }
  return {type: SELECT_THROW_TYPE, throwType};
}

/**
 * Dispatchable action for hitting a number between 1-21 where 21 represents
 * bullseye.
 *
 * @param {number} throwNumber
 * @returns {{type: string, throwNumber: number}}
 */
export function selectThrowNumber(throwNumber) {
  if (autoSubmit) {
    return (dispatch, getState) => {
      dispatch({type: SELECT_THROW_NUMBER, throwNumber});
      dispatch(submitThrow());
    };
  }
  return {type: SELECT_THROW_NUMBER, throwNumber};
}

/**
 * Dispatchable action to update the state that a throw is submitting to the
 * server
 *
 * @returns {{type: string}}
 */
export function submitThrowStart() {
  return {type: SUBMIT_THROW_START};
}

/**
 * Makes the AJAX request and dispatches other actions such as loading and throw
 * complete
 *
 * @returns {Function}
 */
export function submitThrow() {
  return (dispatch, getState) => {
    let throwState = getState().throwState;

    if (throwState.submittable) {
      dispatch(submitThrowStart());

      return fetch('/api/throw', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          type: throwState.throwType,
          number: throwState.throwNumber || 0
        })
      })
        // @todo: add .catch() for error handling
          .then(response =>  response.json())
          .then(json => dispatch(submitThrowComplete(json)))
    } else {
      // @todo: could dispatch an input error here if we wanted
    }
  };
}

/**
 * Dispatchable action to process the response from the server after the throw
 * has been submitted
 *
 * @param {object} response
 * @returns {{type: string, response: object}}
 */
export function submitThrowComplete(response) {
  return {type: SUBMIT_THROW_COMPLETE, response};
}

/**
 * Dispatchable action to undo the last throw.
 *
 * @returns {{type: string}}
 */
export function submitUndoStart() {
  return {type: SUBMIT_UNDO_START};
}

/**
 * Makes the AJAX request and dispatches other actions such as loading and throw
 * complete
 *
 * @returns {Function}
 */
export function submitUndo() {
  return (dispatch, getState) => {
    let throwState = getState().throwState;

    if (!throwState.isSubmitting) {
      dispatch(submitUndoStart());

      return fetch('/api/throw', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          undo: true
        })
      })
        // @todo: add .catch() for error handling
          .then(response =>  response.json())
          .then(json => dispatch(submitUndoComplete(json)))
    } else {
      // @todo: could dispatch an input error here if we wanted
    }
  };
}

/**
 * Dispatchable action to process the response from the server after the throw
 * has been submitted
 *
 * @param {object} response
 * @returns {{type: string, response: object}}
 */
export function submitUndoComplete(response) {
  return {type: SUBMIT_UNDO_COMPLETE, response};
}



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