'use strict';

import React from 'react';
import ThrowTypesContainer from '../../containers/ThrowTypesContainer';
import ThrowNumbersContainer from '../../containers/ThrowNumbersContainer';
import ThrowSubmitButtonContainer from '../../containers/ThrowSubmitButtonContainer';
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