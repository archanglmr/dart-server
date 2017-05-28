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
import ScoreHistoryUpDown from 'components/ScoreHistoryUpDown';
import WidgetTargetNumberContainer from 'containers/WidgetTargetNumberContainer';
import WidgetThrowsContainer from 'containers/WidgetThrowsContainer';
import WidgetPlayerListContainer from 'containers/WidgetPlayerListContainer';
import WidgetDartboardContainer from 'containers/WidgetDartboardContainer';
import PlayerTarget from 'components/PlayerTarget';
import WidgetNotificationQueueContainer from 'containers/WidgetNotificationQueueContainer';

import NotificationSlide from './components/NotificationSlide';


import './slider.scss';


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
              <WidgetScoreHistoryContainer displayLimit={8} valueComponent={ScoreHistoryUpDown} />
              <WidgetThrowsContainer noTempScore={true} />
              <WidgetPlayerListContainer valueComponent={PlayerTarget} />
              <WidgetDartboardContainer />
              <WidgetTargetNumberContainer />
              <WidgetNotificationQueueContainer customNotifications={{slide: NotificationSlide}} />
            </GameClient>
          </Provider>
      ),
      document.getElementById('root')
  );
});