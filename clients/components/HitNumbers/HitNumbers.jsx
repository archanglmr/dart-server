'use strict';

import React, {PropTypes} from 'react';
import ThrowButton from '../ThrowButton';


function HitNumbers({buttons, onHitNumberClick}) {
  return (
      <menu>
        {buttons.map((button) => (
            <ThrowButton
                key={button.id}
                {...button}
                onClick={() => onHitNumberClick(button.id)}
                />
        ))}
      </menu>
  );
}

HitNumbers.propTypes = {
  buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        enabled: PropTypes.bool
      })
  ).isRequired,
  onHitNumberClick: PropTypes.func.isRequired
};

export default HitNumbers;