'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationTon({data}) {
  switch (data) {
    case '80':
      return <FullScreenMessage {...arguments[0]} text="TON 80!!!" />;
    case 'high':
      return <FullScreenMessage {...arguments[0]} text="High Ton!!" />;
    case 'low':
      return <FullScreenMessage {...arguments[0]} text="Low Ton!" />;
  }

  return <FullScreenMessage {...arguments[0]} text="Ton!" />;
}

NotificationTon.propTypes = {
  //data: PropTypes.string
};

export default NotificationTon;