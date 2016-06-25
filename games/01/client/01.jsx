'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import GameClient from './components/GameClient';

// Redux dependencies
import {Provider} from 'react-redux'


// React components
import HeadingContainer from './containers/HeadingContainer';
import WidgetThrowsContainer from './containers/WidgetThrowsContainer';


top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <HeadingContainer />
              <WidgetThrowsContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});