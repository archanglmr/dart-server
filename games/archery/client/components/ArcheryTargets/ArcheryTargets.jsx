'use strict';

import React, {PropTypes} from 'react';
import ArcheryMark from '../ArcheryMark';
import './ArcheryTargets.scss';


function ArcheryTargets({targets}) {
  var targetsList = [];
  for (let className in targets) {
    if (targets.hasOwnProperty(className)) {
      targetsList.push(
          <div key={className} className="row">
            <ArcheryMark className={className} />
            {targets[className]}
          </div>
      );
    }
  }
  return (
      <div className="archery-targets">
        <div className="label">TARGETS</div>
        {targetsList}
      </div>
  );
}

ArcheryTargets.propTypes = {
  targets: PropTypes.object.isRequired
};

export default ArcheryTargets;