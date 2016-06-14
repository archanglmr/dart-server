'use strict';

import {SELECT_HIT_TYPE, SELECT_HIT_NUMBER, SUBMIT_HIT, HitTypesList} from './actions';

const initialState = {
  hitType: null,
  number: null,

  submitable: false,

  disabledHitTypes: [],
  disabledNumbers: []
};


/**
 * The
 * @param state {{hitType: string, number: string, disabledHitTypes: Array, disabledNumbers: Array}}
 * @param action {{type: string}}
 * @returns {{hitType: string, number: string, disabledHitTypes: Array, disabledNumbers: Array}}
 */
export default function throwApp(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  switch(action.type) {
    case SELECT_HIT_TYPE:
      // make sure we have a valid "hit type" and that it's not disabled
      if (HitTypesList.hasOwnProperty(action.hitType) && -1 == state.disabledHitTypes.indexOf(action.hitType)) {
        let newState = {
          submitable: false,
          disabledNumbers: []
        };

        if (state.hitType === action.hitType) {
          newState.hitType = null;
        } else {
          newState.hitType = action.hitType;

          switch (newState.hitType) {
            // all numbers are valid for inner single
            case HitTypesList.INNER_SINGLE:
            // all numbers are valid for double
            case HitTypesList.DOUBLE:
              newState.submitable = !!state.number;
              break;

            case HitTypesList.OUTER_SINGLE:
            case HitTypesList.TRIPLE:
              // can't have a triple bull
              newState.disabledNumbers.push(21);
              newState.submitable = !!state.number;
              break;

            case HitTypesList.MISS:
              // no numbers are valid for a miss
              for (let i = 21; i > 0; i -= 1) {
                newState.disabledNumbers.push(i);
              }
              newState.submitable = true;
              break;
          }
        }

        return Object.assign({}, state, newState);
      }

    case SELECT_HIT_NUMBER:
      // make sure we have a valid "number" and that it's not disabled
      if (action.number > 0 && action.number <= 21 && -1 == state.disabledNumbers.indexOf(action.number)) {
        let newState = {submitable: false};

        if (state.number === action.number) {
          // same number, disable it
          newState.number = null;
          newState.disabledHitTypes = [];
        } else {
          newState.number = action.number;
          newState.disabledHitTypes = [HitTypesList.MISS];
          if (21 === newState.number) {
            newState.disabledHitTypes.push(HitTypesList.TRIPLE, HitTypesList.OUTER_SINGLE);
          }
          newState.submitable = !!state.hitType;
        }

        return Object.assign({}, state, newState);
      }

    case SUBMIT_HIT:
      if (state.submitable) {
        return initialState;
      }

    default:
      return state;
  }
}