'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import HitNumbersContainer from './components/HitNumbersContainer';

// Redux dependencies
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import * as actions from './throw/actions';
import throwApp from './throw/reducers';


// Create the Redux store
var store = createStore(throwApp);


let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);

// Render the React root component
render(
  (
    <Provider store={store}>
      <HitNumbersContainer />
    </Provider>
  ),
  document.getElementById('root')
);