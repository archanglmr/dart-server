'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import GameClient from './components/GameClient';


// Redux dependencies
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './redux/reducers';

// Create the Redux store
var store = createStore(rootReducer);


// Render the React root component
render(
  (
    <Provider store={store}>
      <GameClient />
    </Provider>
  ),
  document.getElementById('root')
);