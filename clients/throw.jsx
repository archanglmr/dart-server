'use strict';

import 'babel-polyfill';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import ThrowClient from './components/ThrowClient';

import GameStateReadyContainer from 'containers/GameStateReadyContainer';
import WidgetGameNameContainer from 'containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from 'containers/WidgetCurrentPlayerContainer';
import WidgetRoundsContainer from 'containers/WidgetRoundsContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetScoreContainer from 'containers/WidgetScoreContainer';
import WidgetTempScoreContainer from 'containers/WidgetTempScoreContainer';

// Redux dependencies
import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux';
import {updateGameState, UPDATE_GAME_STATE} from './display/actions';
import {rootReducer, gameRootReducer} from './throw/reducers';

// Create the Redux store
var store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware)
);
// Create the Redux store
var gameStore = createStore(gameRootReducer),
    socket = io();

let unsubscribe = gameStore.subscribe((store) => console.log('game:', gameStore.getState()));


//let unsubscribe = store.subscribe(() =>
//    console.log(store.getState())
//);

// Render the React root component
render(
  (
    <div>
      <Provider store={store}>
        <ThrowClient>
          <Provider store={gameStore}>
            <GameStateReadyContainer>
              <div className="current-info">
                <WidgetGameNameContainer />
                <WidgetCurrentPlayerContainer />
                <WidgetRoundsContainer />
              </div>
              <WidgetScoreContainer />
              <WidgetTempScoreContainer />
              <WidgetThrowsContainer />
            </GameStateReadyContainer>
          </Provider>
        </ThrowClient>
      </Provider>
    </div>
  ),
  document.getElementById('root')
);


socket.on(UPDATE_GAME_STATE, (data) => {
  gameStore.dispatch(updateGameState(data.state));
});