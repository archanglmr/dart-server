'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';

// Redux dependencies
import {Provider} from 'react-redux';


// React components
import GameClient from 'components/GameClient';
import CornerDash from 'components/CornerDash';
import WidgetGameNameContainer from 'containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from 'containers/WidgetCurrentPlayerContainer';
import WidgetRoundsContainer from 'containers/WidgetRoundsContainer';
import WidgetScoreHistoryContainer from 'containers/WidgetScoreHistoryContainer';
import ScoreHistoryNumber from 'components/ScoreHistoryNumber';
import WidgetTargetNumberContainer from 'containers/WidgetTargetNumberContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';
import WidgetWinnerContainer from 'containers/WidgetWinnerContainer';


import './shanghai.scss';


top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <CornerDash>
                <WidgetGameNameContainer />
                <WidgetCurrentPlayerContainer />
                <WidgetRoundsContainer />
              </CornerDash>
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryNumber} />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
              <WidgetDartboardContainer />
              <WidgetTargetNumberContainer />
              <WidgetWinnerContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});