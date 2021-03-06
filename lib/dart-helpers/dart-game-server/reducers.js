'use strict';

var initialState = require('./initial-state'),
    actions = require('./actions');

/**
 * Root Reducer for all game servers. This allows us to do some boilerplate
 * stuff
 *
 * @param {{object}} state
 * @param {{type: string}} action
 * @returns {*}
 */
module.exports = function rootReducer(state, action = {}) {
  if ('undefined' === typeof state) {
    return initialState;
  }

  switch(action.type) {
    case actions.INIT:
        let {variation, modifiers, players, playerOrder, extras, seed} = action.config,
            newState = Object.assign({}, state, {
              config: Object.assign({}, state.config, {variation, modifiers, extras, seed}),
              players: Object.assign({}, state.players, {order: playerOrder, data: players})
            });

      if (this.actionInit) {
        newState = this.actionInit(newState);
      }

      return Object.assign({}, newState);

    case actions.START_GAME:
      return Object.assign({}, this.actionStartGame(state), {gameName: this.getDisplayName()});

    case actions.PROCESS_THROW:
      return this.actionProcessThrow(state, action.throwData);

    case actions.ADVANCE_GAME:
      return this.actionAdvanceGame(state);

    case actions.UNDO_THROW:
      return action.state;

    case actions.UPDATE_PLAYER_INFO:
      //action.playerInfo;
      break;

    case actions.DART_SERVER_PLUGIN:
      return action.customReducer(state);

    default:
      return state;
  }

  return state;
};
