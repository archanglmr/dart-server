'use strict';

import React, {PropTypes} from 'react';
import ThrowButton from '../ThrowButton';


function ThrowNumbers({buttons, onHitNumberClick}) {
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

ThrowNumbers.propTypes = {
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

export default ThrowNumbers;