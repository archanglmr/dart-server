'use strict';
import {
    SELECT_THROW_TYPE,
    SELECT_THROW_NUMBER,
    SUBMIT_THROW_START,
    SUBMIT_THROW_COMPLETE,
    SUBMIT_UNDO_START,
    SUBMIT_UNDO_COMPLETE,
    ThrowTypesList,
} from './actions-throw-state';

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
 * @param throwState {{throwType: string, throwNumber: string, isSubmitting: bool, submittable: bool, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 * @param action {{type: string}}
 * @returns {{throwType: string, throwNumber: string, isSubmitting: bool, submittable: bool, disabledThrowTypes: Array, disabledThrowNumbers: Array}}
 */
export default function throwStateReducer(throwState, action = {}) {
  if ('undefined' === typeof throwState) {
    return initialState;
  }

  var newThrowState;
  switch(action.type) {
    case SELECT_THROW_TYPE:
      // make sure we have a valid "hit type" and that it's not disabled
      if (ThrowTypesList.hasOwnProperty(action.throwType) && -1 == throwState.disabledThrowTypes.indexOf(action.throwType)) {
        newThrowState = {
          submittable: false,
          disabledThrowNumbers: []
        };

        if (throwState.throwType === action.throwType) {
          newThrowState.throwType = null;
        } else {
          newThrowState.throwType = action.throwType;

          switch (newThrowState.throwType) {
            // all numbers are valid for outer single
            case ThrowTypesList.SINGLE_OUTER:
            // all numbers are valid for double
            case ThrowTypesList.DOUBLE:
              newThrowState.submittable = !!throwState.throwNumber;
              break;

            case ThrowTypesList.SINGLE_INNER:
            case ThrowTypesList.TRIPLE:
              // can't have a triple bull
              newThrowState.disabledThrowNumbers.push(21);
              newThrowState.submittable = !!throwState.throwNumber;
              break;

            case ThrowTypesList.MISS:
              // no numbers are valid for a miss
              for (let i = 21; i > 0; i -= 1) {
                newThrowState.disabledThrowNumbers.push(i);
              }
              newThrowState.submittable = true;
              break;
          }
        }

        return Object.assign({}, throwState, newThrowState);
      }
      break;

    case SELECT_THROW_NUMBER:
      // make sure we have a valid "number" and that it's not disabled
      if (action.throwNumber > 0 && action.throwNumber <= 21 && -1 == throwState.disabledThrowNumbers.indexOf(action.throwNumber)) {
        newThrowState = {submittable: false};

        if (throwState.throwNumber === action.throwNumber) {
          // same number, disable it
          newThrowState.throwNumber = null;
          newThrowState.disabledThrowTypes = [];
        } else {
          newThrowState.throwNumber = action.throwNumber;
          newThrowState.disabledThrowTypes = [ThrowTypesList.MISS];
          if (21 === newThrowState.throwNumber) {
            newThrowState.disabledThrowTypes.push(ThrowTypesList.TRIPLE, ThrowTypesList.SINGLE_INNER);
          }
          newThrowState.submittable = !!throwState.throwType;
        }

        return Object.assign({}, throwState, newThrowState);
      }
      break;

    case SUBMIT_THROW_START:
      newThrowState = {
        isSubmitting: true, // assign isSubmitting to true here
        disabledThrowTypes: [],
        disabledThrowNumbers: [],
        lastState: {
          disabledThrowTypes:  Object.assign({}, throwState.disabledThrowTypes),
          disabledThrowNumbers: Object.assign({}, throwState.disabledThrowNumbers)
        }
      };
      for (let i = 21; i > 0; i -= 1) {
        newThrowState.disabledThrowNumbers.push(i);
      }
      for (let k in ThrowTypesList) {
        if (ThrowTypesList.hasOwnProperty(k)) {
          newThrowState.disabledThrowTypes.push(ThrowTypesList[k]);
        }
      }

      return Object.assign({}, throwState, newThrowState);

    case SUBMIT_THROW_COMPLETE:
      if (action.response.success) {
        return initialState;
      } else if (action.response.error) {
        // @todo: handle error here
      }
      break;

    case SUBMIT_UNDO_START:
      newThrowState = {
        isSubmitting: true, // assign isSubmitting to true here
        disabledThrowTypes: [],
        disabledThrowNumbers: [],
        lastState: {
          disabledThrowTypes:  Object.assign({}, throwState.disabledThrowTypes),
          disabledThrowNumbers: Object.assign({}, throwState.disabledThrowNumbers)
        }
      };
      for (let i = 21; i > 0; i -= 1) {
        newThrowState.disabledThrowNumbers.push(i);
      }
      for (let k in ThrowTypesList) {
        if (ThrowTypesList.hasOwnProperty(k)) {
          newThrowState.disabledThrowTypes.push(ThrowTypesList[k]);
        }
      }
      return Object.assign({}, throwState, newThrowState);

    case SUBMIT_UNDO_COMPLETE:
      if (action.response.success) {
        return initialState;
      } else if (action.response.error) {
        // @todo: handle error here
      }
      break;

    default:
      return throwState;
  }
  return throwState;
}