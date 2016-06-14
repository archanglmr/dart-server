'use strict';

import React, {PropTypes} from 'react';
import ThrowButton from '../ThrowButton';


function ThrowTypes({buttons, onThrowTypeClick}) {
  return (
      <menu>
        {buttons.map((button) => (
            <ThrowButton
                key={button.id}
                {...button}
                onClick={() => onThrowTypeClick(button.id)}
                />
        ))}
      </menu>
  );
}

ThrowTypes.propTypes = {
  buttons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        enabled: PropTypes.bool
      })
  ).isRequired,
  onThrowTypeClick: PropTypes.func.isRequired
};

export default ThrowTypes;