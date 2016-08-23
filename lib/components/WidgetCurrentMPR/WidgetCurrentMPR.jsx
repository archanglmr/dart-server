'use strict';

import React, {PropTypes} from 'react';


function WidgetCurrentMPR({mpr}) {
  return <div className="widget-current-mrp">MPR: {mpr.toFixed(2)}</div>;
}

WidgetCurrentMPR.propTypes = {
  mpr: PropTypes.number.isRequired
};

export default WidgetCurrentMPR;