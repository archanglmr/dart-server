import React from 'react';
import {render} from 'react-dom';
import Display from './components/Display';
import {updateGameState} from './display/actions';


render(<Display src="/display/game/01" />, document.getElementById('body'));


var socket = io(),
    store;


window.registerGame = function(gameStore) {
  "use strict";
  store = gameStore;

  store.dispatch(updateGameState({a:'hello world'}));
};