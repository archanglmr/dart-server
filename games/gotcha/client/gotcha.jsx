'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';

// Redux dependencies
import {Provider} from 'react-redux';


// React components
import GameClient from 'components/GameClient';
import CornerDash from 'components/CornerDash';
import WidgetScoreHistoryContainer from 'containers/WidgetScoreHistoryContainer';
import ScoreHistoryNumber from 'components/ScoreHistoryNumber';
import WidgetWindicatorContainer from 'containers/WidgetWindicatorContainer';
import WidgetCurrentScoreContainer from 'containers/WidgetCurrentScoreContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';
import WidgetWinnerContainer from 'containers/WidgetWinnerContainer';
import PlayerWindicator from 'components/PlayerWindicator';


top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <WidgetCurrentScoreContainer />
              <CornerDash />
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryNumber} />
              <WidgetWindicatorContainer />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer valueComponent={PlayerWindicator} />
              <WidgetDartboardContainer />
              <WidgetWinnerContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});