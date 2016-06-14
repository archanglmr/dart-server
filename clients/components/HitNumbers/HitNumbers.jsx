'use strict';

import React, {PropTypes} from 'react';
import ThrowButton from '../ThrowButton';


function HitNumbers({buttons, onHitNumberClick}) {
  return (
      <nav>
        {buttons.map((button) => (
            <ThrowButton
                key={button.id}
                {...button}
                onClick={() => onHitNumberClick(button.id)}
                />
        ))}
      </nav>
  );
}

const propTypes = {
  buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        enabled: PropTypes.bool
      })
  ).isRequired,
  onHitNumberClick: PropTypes.func.isRequired
};

export default HitNumbers;