'use strict';

/**
 * action types
 */
export const SELECT_THROW_TYPE = 'SELECT_THROW_TYPE';
export const SELECT_THROW_NUMBER = 'SELECT_THROW_NUMBER';
export const SUBMIT_THROW = 'SUBMIT_THROW';


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

export function submitThrow() {
  return {type: SUBMIT_THROW};
}
