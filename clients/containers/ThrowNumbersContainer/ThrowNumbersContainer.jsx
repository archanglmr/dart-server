'use strict';

import {connect} from 'react-redux';
import {selectThrowNumber} from '../../throw/actions';
import ThrowNumbers from '../../components/ThrowNumbers';


const mapStateToProps = (state) => {
  let buttons = [];

  for (let i = 21; i > 0; i -=1) {
    let button = {
      id: i,
      text: '' + (21 === i ? 'B' : i)
    };
    if (i === state.throwNumber) {
      button.selected = true;
    }
    if (-1 !== state.disabledThrowNumbers.indexOf(i)) {
      button.disabled = true;
    }
    buttons.push(button);
  }

  return {buttons};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onThrowNumberClick: (id) => {
      dispatch(selectThrowNumber(id))
    }
  };
};

const ThrowNumbersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThrowNumbers);

export default ThrowNumbersContainer;