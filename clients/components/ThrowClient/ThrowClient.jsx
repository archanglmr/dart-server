'use strict';

import React, {PropTypes} from 'react';
import HitTypesContainer from '../HitTypesContainer';
import HitNumbersContainer from '../HitNumbersContainer';
import ThrowSubmitButtonContainer from '../ThrowSubmitButtonContainer';
import './ThrowClient.scss';

function ThrowClient() {
  return (
      <div>
        <HitTypesContainer />
        <HitNumbersContainer />
        <ThrowSubmitButtonContainer text="Send Throw" />
      </div>
  );
}

export default ThrowClient;