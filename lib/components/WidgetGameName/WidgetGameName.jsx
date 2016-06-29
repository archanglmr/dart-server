'use strict';

import React, {PropTypes} from 'react';


function WidgetGameName({text}) {
  return <h1>{text} Game</h1>;
}

WidgetGameName.propTypes = {
  text: PropTypes.string.isRequired
};

export default WidgetGameName;