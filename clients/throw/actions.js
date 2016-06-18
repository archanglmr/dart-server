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

/**
 * List of throw types
 */
export const ThrowTypesList = ThrowTypes;


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
    let state = getState();

    if (state.submittable) {
      dispatch(submitThrowStart());

      return fetch('/api/throw', {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          section: state.throwType,
          number: state.throwNumber
        })
      })
        // @todo: add .catch() for error handling
          .then(response =>  response.json())
          .then(json => dispatch(submitThrowComplete(json)))
    } else {
      // @todo: could dispatch an input error here if we wenated
    }
  };
}

/**
 * Dispatchable action to process the respons from the server after the throw
 * has been submitted
 *
 * @param {object} response
 * @returns {{type: string, response: object}}
 */
export function submitThrowComplete(response) {
  return {type: SUBMIT_THROW_COMPLETE, response};
}