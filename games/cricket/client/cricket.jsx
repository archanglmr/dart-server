'use strict';

// React dependencies
import React from 'react';
import {render} from 'react-dom';

// Redux dependencies
import {Provider} from 'react-redux';


// React components
import GameClient from 'components/GameClient';
import CornerDash from 'components/CornerDash';
import NotificationWhiteHorse from 'components/NotificationWhiteHorse';
import NotificationMarks from 'components/NotificationMarks';
import WidgetScoreHistoryContainer from 'containers/WidgetScoreHistoryContainer';
import ScoreHistoryCricket from 'components/ScoreHistoryCricket';
import WidgetCricketDisplayContainer from 'containers/WidgetCricketDisplayContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';
import WidgetWinnerContainer from 'containers/WidgetWinnerContainer';
import WidgetNotificationQueueContainer from 'containers/WidgetNotificationQueueContainer';
import WidgetCurrentMPRContainer from 'containers/WidgetCurrentMPRContainer';

top.window.registerGame((store) => {
  let unsubscribe = store.subscribe(() => {
    console.log('iframe:', store.getState());
  });

  // Render the React root component
  render(
      (
          <Provider store={store}>
            <GameClient>
              <WidgetCricketDisplayContainer />
              <CornerDash>
                <WidgetCurrentMPRContainer />
              </CornerDash>
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryCricket} />
              <WidgetThrowsContainer />
              <WidgetPlayerListContainer />
              <WidgetDartboardContainer />
              <WidgetWinnerContainer />
              <WidgetNotificationQueueContainer customNotifications={{white_horse: NotificationWhiteHorse, marks: NotificationMarks}} />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});