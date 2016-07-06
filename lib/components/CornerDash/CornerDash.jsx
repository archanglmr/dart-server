'use strict';

import React, {PropTypes} from 'react';
import './CornerDash.scss';

import WidgetGameNameContainer from 'containers/WidgetGameNameContainer';
import WidgetCurrentPlayerContainer from 'containers/WidgetCurrentPlayerContainer';
import WidgetRoundsContainer from 'containers/WidgetRoundsContainer';



function CornerDash({children}) {
  return (
      <div className="corner-dash">
        <WidgetGameNameContainer />
        <WidgetCurrentPlayerContainer />
        <WidgetRoundsContainer />
        {children}
      </div>
  );
}


export default CornerDash;