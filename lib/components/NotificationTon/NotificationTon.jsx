'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationTon({data}) {
  switch (data) {
    case '80':
      return <FullScreenMessage text="TON 80!!!" />;
    case 'high':
      return <FullScreenMessage text="High Ton!!" />;
    case 'low':
      return <FullScreenMessage text="Low Ton!" />;
  }

  return null;
}

NotificationTon.propTypes = {
  data: PropTypes.string
};

export default NotificationTon;