'use strict';

import React, {PropTypes} from 'react';
import './CornerDash.scss';

import WidgetGameNameContainer from 'containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from 'containers/WidgetCurrentPlayerContainer';



function CornerDash({children}) {
  return (
      <div className="corner-dash">
        <WidgetGameNameContainer />
        <WidgetCurrentPlayerContainer />
        {children}
      </div>
  );
}


export default CornerDash;