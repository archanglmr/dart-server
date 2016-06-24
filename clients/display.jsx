'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import Display from './components/Display';


// Redux dependencies
import {createStore} from 'redux'
import {updateGameState, UPDATE_GAME_STATE} from './display/actions';
import rootReducer from './display/reducers';

// Create the Redux store
var store = createStore(rootReducer);
var socket = io();

//let unsubscribe = store.subscribe(() => console.log('display:', store.getState()));

render(<Display src="/display/game/01" />, document.getElementById('root'));




socket.on(UPDATE_GAME_STATE, (data) => {
  updateGameState(data);
});


/**
 * This function is called by the iframe window once it's loaded in order to
 * give it access to the redux store. Once the iframe has the store it should
 * render it's react components with the Provider component.
 *
 * @param cb
 */
window.registerGame = (cb) => {
  cb(store);
  store.dispatch(updateGameState({a:'hello world'}));
};