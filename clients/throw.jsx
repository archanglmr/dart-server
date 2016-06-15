'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import ThrowClient from './components/ThrowClient';

// Redux dependencies
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './throw/reducers';

// Create the Redux store
var store = createStore(rootReducer);


let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);

// Render the React root component
render(
  (
    <Provider store={store}>
      <ThrowClient />
    </Provider>
  ),
  document.getElementById('root')
);