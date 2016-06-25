'use strict';

import React, {PropTypes} from 'react';


function Heading({text}) {
  return <h1>Welcome to {text}</h1>;
}

Heading.propTypes = {
  text: PropTypes.string.isRequired
};

export default Heading;