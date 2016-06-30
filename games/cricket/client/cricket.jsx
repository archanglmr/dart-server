'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';

// Redux dependencies
import {Provider} from 'react-redux'


// React components
import GameClient from 'components/GameClient';
import WidgetGameNameContainer from 'containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from 'containers/WidgetCurrentPlayerContainer';
import WidgetRoundsContainer from 'containers/WidgetRoundsContainer';
import WidgetScoreHistoryContainer from 'containers/WidgetScoreHistoryContainer';
import WidgetTempScoreContainer from 'containers/WidgetTempScoreContainer';
import WidgetCricketDisplayContainer from 'containers/WidgetCricketDisplayContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';


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
              <WidgetTempScoreContainer />
              <WidgetCricketDisplayContainer />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
              <WidgetDartboardContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});