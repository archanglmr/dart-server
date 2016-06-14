'use strict';

import {SELECT_HIT_TYPE, SELECT_NUMBER, HitTypes} from './actions';

const initialState = {
  hitType: null,
  number: null,

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
      if (HitTypes.hasOwnProperty(action.hitType) && -1 == state.disabledHitTypes.indexOf(action.hitType)) {
        let newState = {
          disabledNumbers: []
        };

        if (state.hitType === action.hitType) {
          newState.hitType = null;
        } else {
          newState.hitType = action.hitType;

          switch (newState.hitType) {
            // all numbers are valid for inner single
            case HitTypes.INNER_SINGLE:
            // all numbers are valid for double
            case HitTypes.DOUBLE:
            // @todo: Decide if outer single bull is ok, for now sure.
            case HitTypes.OUTER_SINGLE:
              break;

            case HitTypes.TRIPLE:
              // can't have a triple bull
              newState.disabledNumbers.push(21);
              break;

            case HitTypes.MISS:
              // no numbers are valid for a miss
              for (let i = 21; i > 0; i -= 1) {
                newState.disabledNumbers.push(i);
              }
              break;
          }
        }

        return Object.assign({}, state, newState);
      }

    case SELECT_NUMBER:
      // make sure we have a valid "number" and that it's not disabled
      if (action.number > 0 && action.number <= 21 && -1 == state.disabledNumbers.indexOf(action.number)) {
        let newState = {};

        if (state.number === action.number) {
          // same number, disable it
          newState.number = null;
          newState.disabledHitTypes = [];
        } else {
          newState.number = action.number;
          newState.disabledHitTypes = [HitTypes.MISS];
          if (21 === newState.number) {
            // @todo: Add HitType.OUTER_SINGLE if we decide that's not ok
            newState.disabledHitTypes.push(HitTypes.TRIPLE);
          }
        }

        return Object.assign({}, state, newState);
      }

    default:
      return state;
  }
}