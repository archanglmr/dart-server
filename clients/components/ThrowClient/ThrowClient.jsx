'use strict';

import React from 'react';
import ThrowTypesContainer from '../../containers/ThrowTypesContainer';
import ThrowNumbersContainer from '../../containers/ThrowNumbersContainer';
import ThrowSubmitButtonContainer from '../../containers/ThrowSubmitButtonContainer';
import ThrowUndoButtonContainer from '../../containers/ThrowUndoButtonContainer';

import './ThrowClient.scss';

function ThrowClient({children}) {
  return (
      <div className="throw-client">
        {children}
        <div className="controls">
          <ThrowTypesContainer />
          <ThrowNumbersContainer />
          <ThrowSubmitButtonContainer text="Send Throw" className="submit" />
        </div>
        <ThrowUndoButtonContainer text="Undo Throw" className="undo" />
      </div>
  );
}

export default ThrowClient;