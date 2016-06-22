'use strict';

import React from 'react';
import ThrowTypesContainer from '../ThrowTypesContainer';
import ThrowNumbersContainer from '../ThrowNumbersContainer';
import ThrowSubmitButtonContainer from '../ThrowSubmitButtonContainer';
import './ThrowClient.scss';

function ThrowClient() {
  return (
      <div>
        <ThrowTypesContainer />
        <ThrowNumbersContainer />
        <ThrowSubmitButtonContainer text="Send Throw" />
      </div>
  );
}

export default ThrowClient;