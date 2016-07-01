'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import DisplayContainer from './containers/DisplayContainer';


// Redux dependencies
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {updateDisplayUrl, updateGameState, UPDATE_GAME_STATE} from './display/actions';
import {clientRootReducer, displayRootReducer} from './display/reducers';

// Create the Redux store
var clientStore = createStore(clientRootReducer),
    displayStore = createStore(displayRootReducer),
    socket = io(),
    currentDisplay = '';

let unsubscribe = displayStore.subscribe((store) => console.log('display:', displayStore.getState()));

render(
  (
    <Provider store={displayStore}>
      <DisplayContainer />
    </Provider>
  ),
  document.getElementById('root')
);




socket.on(UPDATE_GAME_STATE, (data) => {
  if (currentDisplay !== data.display) {
    currentDisplay = data.display;
    displayStore.dispatch(updateDisplayUrl(currentDisplay));
    console.log('update display and cause redraw');
  }
  clientStore.dispatch(updateGameState(data.state));
});


/**
 * This function is called by the iframe window once it's loaded in order to
 * give it access to the redux store. Once the iframe has the store it should
 * render it's react components with the Provider component.
 *
 * @param cb
 */
window.registerGame = (cb) => cb(clientStore);