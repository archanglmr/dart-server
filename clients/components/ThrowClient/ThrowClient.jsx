'use strict';

import React, {PropTypes} from 'react';
import HitTypesContainer from '../HitTypesContainer';
import HitNumbersContainer from '../HitNumbersContainer';

function ThrowClient() {
  return (
      <div>
        <HitTypesContainer />
        <HitNumbersContainer />
      </div>
  );
}

export default ThrowClient;