'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import GameClient from './components/GameClient';


// Redux dependencies
import {createStore} from 'redux'
import {Provider} from 'react-redux'

// @fixme Move this to a better spot
import rootReducer from '../../../clients/display/reducers';

// Create the Redux store
var store = createStore(rootReducer);

let unsubscribe = store.subscribe(() =>
    console.log('subscribe:', store.getState())
);


// Render the React root component
render(
  (
    <Provider store={store}>
      <GameClient />
    </Provider>
  ),
  document.getElementById('root')
);


top.window.registerGame(store);