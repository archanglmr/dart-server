'use strict';

import React, {PropTypes} from 'react';


function WidgetCurrentPPD({ppd}) {
  return <div className="widget-current-ppd">PPD: {ppd.toFixed(2)}</div>;
}

WidgetCurrentPPD.propTypes = {
  ppd: PropTypes.number.isRequired
};

export default WidgetCurrentPPD;