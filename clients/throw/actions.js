'use strict';

/**
 * action types
 */
export const SELECT_HIT_TYPE = 'SELECT_HIT_TYPE';
export const SELECT_NUMBER = 'SELECT_NUMBER';


/**
 * Other constants
 */
export const HitTypes = {
  INNER_SINGLE: 'INNER_SINGLE',
  TRIPLE: 'TRIPLE',
  OUTER_SINGLE: 'OUTER_SINGLE',
  DOUBLE: 'DOUBLE',
  MISS: 'MISS'
};

export function selectHitType(hitType) {
  return {type: SELECT_HIT_TYPE, hitType};
}


export function selectNumber(number) {
  return {type: SELECT_NUMBER, number};
}
