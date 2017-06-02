'use strict';

import React, {PropTypes} from 'react';
import FullScreenMessage from '../FullScreenMessage';


import SOUND_BUST from 'base64!./sounds/bust.mp3'; // http://soundbible.com/994-Mirror-Shattering.html

function NotificationBust() {
  return <FullScreenMessage {...arguments[0]} text="B-U-S-T!!!" sound={'data:audio/mpeg;base64,' + SOUND_BUST} />;
}

export default NotificationBust;