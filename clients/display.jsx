'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import Display from './components/Display';


// Redux dependencies
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {updateGameState} from './display/actions';
import rootReducer from './display/reducers';

// Create the Redux store
var store = createStore(rootReducer);

let unsubscribe = store.subscribe(() => console.log('display:', store.getState()));



render(<Display src="/display/game/01" />, document.getElementById('root'));


var socket = io();


window.registerGame = function(cb) {
  cb(store);
  store.dispatch(updateGameState({a:'hello world'}));
};