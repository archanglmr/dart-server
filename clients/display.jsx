'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';

import GameClient from 'components/GameClient';
import DisplayContainer from './containers/DisplayContainer';
import LoadingContainer from './containers/LoadingContainer';
import GameMenuContainer from './containers/GameMenuContainer';


// Redux dependencies
import {createStore} from 'redux';
import {Provider} from 'react-redux';

// Our Rexux reducers and actions
import {
    updateDisplayUrl, clientLoaded, updateGameState,
    updateGameMenu,
    UPDATE_GAME_STATE,
    UPDATE_DISPLAY_URL,
    UPDATE_GAME_MENU
} from './display/actions';
import {gameDisplayClientRootReducer, gameDisplayContainerRootReducer} from './display/reducers';

// Create the Redux store
var gameDisplayClientStore = null,
    gameDisplayContainerStore = createStore(gameDisplayContainerRootReducer),
    currentDisplay = '';

/*
 We only need to subscribe to UPDATE_GAME_STATE because we are only pulling
 data from the game state.
 */
io()
    .on(UPDATE_DISPLAY_URL, (data) => {
      if (currentDisplay !== data.url) {
        gameDisplayContainerStore.dispatch(updateDisplayUrl((currentDisplay = data.url)));
        gameDisplayClientStore = createStore(gameDisplayClientRootReducer);
      }
    })
    .on(UPDATE_GAME_STATE, (state) => {
      gameDisplayClientStore.dispatch(updateGameState(state));
    })
    .on(UPDATE_GAME_MENU, (data) => {
      //console.log('UPDATE_GAME_MENU', data);
      gameDisplayContainerStore.dispatch(updateGameMenu(data));
      //console.log('game menu visibility:', gameDisplayContainerStore.getState());
    });

/**
 * This function is called by the iframe window once it's loaded in order to
 * give it access to the redux store. Once the iframe has the store it should
 * render it's react components with the Provider component.
 *
 * @param cb
 */
window.registerGame = (cb) => {
  cb(gameDisplayClientStore);
  gameDisplayContainerStore.dispatch(clientLoaded());
};

// Render the React root component
render(
  (
    <Provider store={gameDisplayContainerStore}>
      <GameClient>
        <DisplayContainer />
        <GameMenuContainer />
        <LoadingContainer />
      </GameClient>
    </Provider>
  ),
  document.getElementById('root')
);




// This is really just for debugging
//gameDisplayContainerStore.subscribe(() => console.log('game display container:', gameDisplayContainerStore.getState()));