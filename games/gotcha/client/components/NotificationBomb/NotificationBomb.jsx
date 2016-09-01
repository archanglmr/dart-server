'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from 'components/FullScreenMessage';


function NotificationBomb({data}) {
  return <FullScreenMessage {...arguments[0]} text={(data ? data.name : '') + " was bombed!!!"} />;
}

NotificationBomb.propTypes = {
  data: PropTypes.object
};

export default NotificationBomb;