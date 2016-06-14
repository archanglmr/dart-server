'use strict';

import {connect} from 'react-redux';
import {selectHitNumber} from '../../throw/actions';
import HitNumbers from '../HitNumbers';


const mapStateToProps = (state) => {
  let buttons = [];

  for (let i = 21; i > 0; i -=1) {
    let button = {
      id: i,
      text: '' + (21 === i ? 'B' : i)
    };
    if (i === state.number) {
      button.selected = true;
    } else if (-1 !== state.disabledNumbers.indexOf(i)) {
      button.disabled = true;
    }
    buttons.push(button);
  }

  return {buttons};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onHitNumberClick: (id) => {
      dispatch(selectHitNumber(id))
    }
  };
};

const HitNumbersContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HitNumbers);

export default HitNumbersContainer;