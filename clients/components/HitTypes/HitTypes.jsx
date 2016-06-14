'use strict';

import React, {PropTypes} from 'react';
import ThrowButton from '../ThrowButton';


function HitTypes({buttons, onHitTypeClick}) {
  return (
      <nav>
        {buttons.map((button) => (
            <ThrowButton
                key={button.id}
                {...button}
                onClick={() => onHitTypeClick(button.id)}
                />
        ))}
      </nav>
  );
}

HitTypes.propTypes = {
  buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        enabled: PropTypes.bool
      })
  ).isRequired,
  onHitTypeClick: PropTypes.func.isRequired
};

export default HitTypes;