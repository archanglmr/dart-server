'use strict';

import {SELECT_THROW_TYPE, SELECT_THROW_NUMBER, SUBMIT_THROW, ThrowTypesList} from './actions';

const initialState = {
  throwType: null,
  throwNumber: null,

  submitable: false,

  disabledThrowTypes: [],
  disabledThrowNumbers: []
};


/**
 * The
 * @param state {{throwType: string, throwNumber: string, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 * @param action {{type: string}}
 * @returns {{throwType: string, throwNumber: string, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 */
export default function throwApp(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  switch(action.type) {
    case SELECT_THROW_TYPE:
      // make sure we have a valid "hit type" and that it's not disabled
      if (ThrowTypesList.hasOwnProperty(action.throwType) && -1 == state.disabledThrowTypes.indexOf(action.throwType)) {
        let newState = {
          submitable: false,
          disabledThrowNumbers: []
        };

        if (state.throwType === action.throwType) {
          newState.throwType = null;
        } else {
          newState.throwType = action.throwType;

          switch (newState.throwType) {
            // all numbers are valid for inner single
            case ThrowTypesList.INNER_SINGLE:
            // all numbers are valid for double
            case ThrowTypesList.DOUBLE:
              newState.submitable = !!state.throwNumber;
              break;

            case ThrowTypesList.OUTER_SINGLE:
            case ThrowTypesList.TRIPLE:
              // can't have a triple bull
              newState.disabledThrowNumbers.push(21);
              newState.submitable = !!state.throwNumber;
              break;

            case ThrowTypesList.MISS:
              // no numbers are valid for a miss
              for (let i = 21; i > 0; i -= 1) {
                newState.disabledThrowNumbers.push(i);
              }
              newState.submitable = true;
              break;
          }
        }

        return Object.assign({}, state, newState);
      }

    case SELECT_THROW_NUMBER:
      // make sure we have a valid "number" and that it's not disabled
      if (action.throwNumber > 0 && action.throwNumber <= 21 && -1 == state.disabledThrowNumbers.indexOf(action.throwNumber)) {
        let newState = {submitable: false};

        if (state.throwNumber === action.throwNumber) {
          // same number, disable it
          newState.throwNumber = null;
          newState.disabledThrowTypes = [];
        } else {
          newState.throwNumber = action.throwNumber;
          newState.disabledThrowTypes = [ThrowTypesList.MISS];
          if (21 === newState.throwNumber) {
            newState.disabledThrowTypes.push(ThrowTypesList.TRIPLE, ThrowTypesList.OUTER_SINGLE);
          }
          newState.submitable = !!state.throwType;
        }

        return Object.assign({}, state, newState);
      }

    case SUBMIT_THROW:
      if (state.submitable) {
        return initialState;
      }

    default:
      return state;
  }
}