'use strict';

import 'babel-polyfill';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import ThrowClient from './components/ThrowClient';

import CornerDash from 'components/CornerDash';
import GameStateReadyContainer from 'containers/GameStateReadyContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetScoreContainer from 'containers/WidgetScoreContainer';
import WidgetTempScoreContainer from 'containers/WidgetTempScoreContainer';

// Redux dependencies
import thunkMiddleware from 'redux-thunk';
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux';

// Our Rexux reducers and actions
import {updateGameState, UPDATE_GAME_STATE} from './display/actions';
import {throwClientRootReducer, gameDisplayRootReducer} from './throw/reducers';

// Create the Redux stores
var throwClientStore = createStore(throwClientRootReducer, applyMiddleware(thunkMiddleware)),
    gameDisplayStore = createStore(gameDisplayRootReducer);

/*
 We only need to subscribe to UPDATE_GAME_STATE because we are only pulling
 data from the game state. We are not showing the real client or worrying about
 redirects or anything.
 */
io().on(UPDATE_GAME_STATE, (state) => {
  gameDisplayStore.dispatch(updateGameState(state));
});

// Render the React root component
render(
  (
    <div>
      <Provider store={throwClientStore}>
        <ThrowClient>
          <Provider store={gameDisplayStore}>
            <GameStateReadyContainer>
              <CornerDash />
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




// These are really just for debugging
//gameDisplayStore.subscribe(() => console.log('game display:', gameDisplayStore.getState()));
//throwClientStore.subscribe(() => console.log('throw client:', throwClientStore.getState()));