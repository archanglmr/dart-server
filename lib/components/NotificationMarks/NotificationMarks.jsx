'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


function NotificationMarks({data}) {
    return <FullScreenMessage text={data + ' Mark!'} />;
}

NotificationMarks.propTypes = {
  data: PropTypes.number
};

export default NotificationMarks;