'use strict';

/**
 * action types
 */
export const SELECT_HIT_TYPE = 'SELECT_HIT_TYPE';
export const SELECT_HIT_NUMBER = 'SELECT_HIT_NUMBER';


/**
 * Other constants
 */
export const HitTypesList = {
  INNER_SINGLE: 'INNER_SINGLE',
  TRIPLE: 'TRIPLE',
  OUTER_SINGLE: 'OUTER_SINGLE',
  DOUBLE: 'DOUBLE',
  MISS: 'MISS'
};

export function selectHitType(hitType) {
  return {type: SELECT_HIT_TYPE, hitType};
}


export function selectHitNumber(number) {
  return {type: SELECT_HIT_NUMBER, number};
}
