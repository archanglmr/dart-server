'use strict';

import React, {PropTypes} from 'react';
import './ThrowButton.scss';


function ThrowButton({onClick, disabled, selected, text, className}) {
  var className = [className, 'throwButton'];

  if (disabled) {
    className.push('disabled');
  } else if (selected) {
    className.push('selected');
  }

  if (window.navigator.standalone) {
    return (
        <button
            onTouchEnd={onClick}
            className={className.join(' ')}
            disabled={disabled}
            >
          {text}
        </button>
    );
  }
  return (
      <button
          onClick={onClick}
          className={className.join(' ')}
          disabled={disabled}
          >
        {text}
      </button>
  );
}

ThrowButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default ThrowButton;