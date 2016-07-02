'use strict';

import {
    SELECT_THROW_TYPE,
    SELECT_THROW_NUMBER,
    SUBMIT_THROW_START,
    SUBMIT_THROW_COMPLETE,
    SUBMIT_UNDO_START,
    SUBMIT_UNDO_COMPLETE,
    ThrowTypesList
} from './actions';
import {UPDATE_GAME_STATE} from '../display/actions';

const initialState = {
  throwType: null,
  throwNumber: null,

  isSubmitting: false,
  submittable: false,

  disabledThrowTypes: [],
  disabledThrowNumbers: []
};


/**
 * The "Root Reducer" for the throw client
 *
 * @param state {{throwType: string, throwNumber: string, isSubmitting: bool, submittable: bool, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 * @param action {{type: string}}
 * @returns {{throwType: string, throwNumber: string, isSubmitting: bool, submittable: bool, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 */
export function rootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  var newState;
  switch(action.type) {
    case SELECT_THROW_TYPE:
      // make sure we have a valid "hit type" and that it's not disabled
      if (ThrowTypesList.hasOwnProperty(action.throwType) && -1 == state.disabledThrowTypes.indexOf(action.throwType)) {
        newState = {
          submittable: false,
          disabledThrowNumbers: []
        };

        if (state.throwType === action.throwType) {
          newState.throwType = null;
        } else {
          newState.throwType = action.throwType;

          switch (newState.throwType) {
            // all numbers are valid for outer single
            case ThrowTypesList.SINGLE_OUTER:
            // all numbers are valid for double
            case ThrowTypesList.DOUBLE:
              newState.submittable = !!state.throwNumber;
              break;

            case ThrowTypesList.SINGLE_INNER:
            case ThrowTypesList.TRIPLE:
              // can't have a triple bull
              newState.disabledThrowNumbers.push(21);
              newState.submittable = !!state.throwNumber;
              break;

            case ThrowTypesList.MISS:
              // no numbers are valid for a miss
              for (let i = 21; i > 0; i -= 1) {
                newState.disabledThrowNumbers.push(i);
              }
              newState.submittable = true;
              break;
          }
        }

        return Object.assign({}, state, newState);
      }
      break;

    case SELECT_THROW_NUMBER:
      // make sure we have a valid "number" and that it's not disabled
      if (action.throwNumber > 0 && action.throwNumber <= 21 && -1 == state.disabledThrowNumbers.indexOf(action.throwNumber)) {
        newState = {submittable: false};

        if (state.throwNumber === action.throwNumber) {
          // same number, disable it
          newState.throwNumber = null;
          newState.disabledThrowTypes = [];
        } else {
          newState.throwNumber = action.throwNumber;
          newState.disabledThrowTypes = [ThrowTypesList.MISS];
          if (21 === newState.throwNumber) {
            newState.disabledThrowTypes.push(ThrowTypesList.TRIPLE, ThrowTypesList.SINGLE_INNER);
          }
          newState.submittable = !!state.throwType;
        }

        return Object.assign({}, state, newState);
      }
      break;

    case SUBMIT_THROW_START:
      newState = {
        isSubmitting: true, // assign isSubmitting to true here
        disabledThrowTypes: [],
        disabledThrowNumbers: [],
        lastState: {
          disabledThrowTypes:  Object.assign({}, state.disabledThrowTypes),
          disabledThrowNumbers: Object.assign({}, state.disabledThrowNumbers)
        }
      };
      for (let i = 21; i > 0; i -= 1) {
        newState.disabledThrowNumbers.push(i);
      }
      for (let k in ThrowTypesList) {
        if (ThrowTypesList.hasOwnProperty(k)) {
          newState.disabledThrowTypes.push(ThrowTypesList[k]);
        }
      }

      return Object.assign({}, state, newState);

    case SUBMIT_THROW_COMPLETE:
        if (action.response.success) {
          return initialState;
        } else if (action.response.error) {
          // @todo: handle error here
        }
      break;

    case SUBMIT_UNDO_START:
      newState = {
        isSubmitting: true, // assign isSubmitting to true here
        disabledThrowTypes: [],
        disabledThrowNumbers: [],
        lastState: {
          disabledThrowTypes:  Object.assign({}, state.disabledThrowTypes),
          disabledThrowNumbers: Object.assign({}, state.disabledThrowNumbers)
        }
      };
      for (let i = 21; i > 0; i -= 1) {
        newState.disabledThrowNumbers.push(i);
      }
      for (let k in ThrowTypesList) {
        if (ThrowTypesList.hasOwnProperty(k)) {
          newState.disabledThrowTypes.push(ThrowTypesList[k]);
        }
      }
      return Object.assign({}, state, newState);

    case SUBMIT_UNDO_COMPLETE:
      if (action.response.success) {
        return initialState;
      } else if (action.response.error) {
        // @todo: handle error here
      }
      break;

    default:
      return state;
  }
  return state;
}



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