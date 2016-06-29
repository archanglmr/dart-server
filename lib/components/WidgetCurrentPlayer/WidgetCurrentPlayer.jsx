'use strict';

import React, {PropTypes} from 'react';
import './WidgetCurrentPlayer.scss';


function WidgetCurrentPlayer({text}) {
  return <div className="widget-current-player">{text}</div>;
}

WidgetCurrentPlayer.propTypes = {
  text: PropTypes.string.isRequired
};

export default WidgetCurrentPlayer;