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
import ScoreHistoryArchery from './components/ScoreHistoryArchery';
import BullsHitContainer from './containers/BullsHitContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';
import WidgetWinnerContainer from 'containers/WidgetWinnerContainer';
import WidgetNotificationQueueContainer from 'containers/WidgetNotificationQueueContainer';
import ArcheryTargetsContainer from './containers/ArcheryTargetsContainer';


import './archery.scss';


top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <CornerDash />
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryArchery} />
              <BullsHitContainer />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
              <WidgetDartboardContainer />
              <ArcheryTargetsContainer />
              <WidgetWinnerContainer />
              <WidgetNotificationQueueContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});