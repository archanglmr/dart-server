'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import GameClient from 'components/GameClient';
import DisplayContainer from './containers/DisplayContainer';
import LoadingContainer from './containers/LoadingContainer';


// Redux dependencies
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {updateDisplayUrl, clientLoaded, updateGameState, UPDATE_GAME_STATE} from './display/actions';
import {clientRootReducer, displayRootReducer} from './display/reducers';

// Create the Redux store
var clientStore = null,
    displayStore = createStore(displayRootReducer),
    socket = io(),
    currentDisplay = '';

let unsubscribe = displayStore.subscribe((store) => console.log('display:', displayStore.getState()));

render(
  (
    <Provider store={displayStore}>
      <GameClient>
        <DisplayContainer />
        <LoadingContainer />
      </GameClient>
    </Provider>
  ),
  document.getElementById('root')
);




socket.on(UPDATE_GAME_STATE, (data) => {
  if (currentDisplay !== data.display) {
    console.log('update display and cause redraw');
    clientStore = null;
    displayStore.dispatch(updateDisplayUrl((currentDisplay = data.display)));
    clientStore = createStore(clientRootReducer);
    clientStore.dispatch(updateGameState(data.state));
  } else {
    console.log('normal client dispatch');
    clientStore.dispatch(updateGameState(data.state));
  }
});


/**
 * This function is called by the iframe window once it's loaded in order to
 * give it access to the redux store. Once the iframe has the store it should
 * render it's react components with the Provider component.
 *
 * @param cb
 */
window.registerGame = (cb) => {
  cb(clientStore);
  displayStore.dispatch(clientLoaded());
};