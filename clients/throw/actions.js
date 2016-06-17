'use strict';
import fetch from 'isomorphic-fetch';

/**
 * action types
 */
export const SELECT_THROW_TYPE = 'SELECT_THROW_TYPE';
export const SELECT_THROW_NUMBER = 'SELECT_THROW_NUMBER';
export const SUBMIT_THROW_START = 'SUBMIT_THROW_START';
export const SUBMIT_THROW_COMPLETE = 'SUBMIT_THROW_COMPLETE';


/**
 * Other constants
 */
export const ThrowTypesList = {
  INNER_SINGLE: 'INNER_SINGLE',
  TRIPLE: 'TRIPLE',
  OUTER_SINGLE: 'OUTER_SINGLE',
  DOUBLE: 'DOUBLE',
  MISS: 'MISS'
};

export function selectThrowType(throwType) {
  return {type: SELECT_THROW_TYPE, throwType};
}

export function selectThrowNumber(throwNumber) {
  return {type: SELECT_THROW_NUMBER, throwNumber};
}

export function submitThrowStart() {
  return {type: SUBMIT_THROW_START};
}

/**
 * Makes the AJAX request and triggers other actions for loading and whatnot
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

export function submitThrowComplete(response) {
  return {type: SUBMIT_THROW_COMPLETE, response};
}