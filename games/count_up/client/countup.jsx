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
import WidgetCurrentScoreContainer from 'containers/WidgetCurrentScoreContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetNotificationQueueContainer from 'containers/WidgetNotificationQueueContainer';
import WidgetCurrentPPDContainer from 'containers/WidgetCurrentPPDContainer';


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
              <CornerDash>
                <WidgetCurrentPPDContainer />
              </CornerDash>
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryNumber} />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
              <WidgetNotificationQueueContainer />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});