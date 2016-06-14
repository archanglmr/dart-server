'use strict';

import React, {PropTypes} from 'react';
import HitTypesContainer from '../HitTypesContainer';
import HitNumbersContainer from '../HitNumbersContainer';
import HitSubmitButtonContainer from '../HitSubmitButtonContainer';
import './ThrowClient.scss';

function ThrowClient() {
  return (
      <div>
        <HitTypesContainer />
        <HitNumbersContainer />
        <HitSubmitButtonContainer text="Send Throw" />
      </div>
  );
}

export default ThrowClient;