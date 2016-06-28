'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';
import GameClient from './components/GameClient';

// Redux dependencies
import {Provider} from 'react-redux'


// React components
import WidgetGameNameContainer from './containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from './containers/WidgetCurrentPlayerContainer';
import WidgetRoundsContainer from './containers/WidgetRoundsContainer';
import WidgetScoreHistoryContainer from './containers/WidgetScoreHistoryContainer';
import WidgetWindicatorContainer from './containers/WidgetWindicatorContainer';
import WidgetCurrentScoreContainer from './containers/WidgetCurrentScoreContainer';
//import WidgetTempScoreContainer from './containers/WidgetTempScoreContainer';
//<WidgetTempScoreContainer />
import WidgetThrowsContainer from './containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from './containers/WidgetPlayerListContainer';


top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <div style={{margin: '1vh 1vw'}}>
                <WidgetGameNameContainer />
                <WidgetCurrentPlayerContainer />
                <WidgetRoundsContainer />
              </div>
              <WidgetScoreHistoryContainer displayLimit={8} />
              <WidgetWindicatorContainer />
              <WidgetCurrentScoreContainer />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});