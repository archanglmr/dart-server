'use strict';

import React, {PropTypes} from 'react';
import './WidgetRounds.scss';


function WidgetRounds({current, limit}) {
  return (
    <div className="widget-rounds">
      Round <span className="current">{current}</span> / <span className="limit">{limit}</span>
    </div>
  );
}

WidgetRounds.propTypes = {
  current: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};

export default WidgetRounds;