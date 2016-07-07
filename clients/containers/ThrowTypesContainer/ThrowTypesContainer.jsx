'use strict';

import {connect} from 'react-redux';
import {selectThrowType, ThrowTypesList} from '../../throw/actions-throw-state';
import ThrowTypes from '../../components/ThrowTypes';


const mapStateToProps = (state) => {
  let buttons = [];

  for (let key in ThrowTypesList) {
    if (ThrowTypesList.hasOwnProperty(key)) {
      let button = {id: key};
      switch(key) {
        case ThrowTypesList.SINGLE_INNER:
          button.text = 'Inner';
          button.className = 'inner';
          break;

        case ThrowTypesList.TRIPLE:
          button.text = 'Triple';
          button.className = 'triple';
          break;

        case ThrowTypesList.SINGLE_OUTER:
          button.text = 'Outer';
          button.className = 'outer';
          break;

        case ThrowTypesList.DOUBLE:
          button.text = 'Double';
          button.className = 'double';
          break;

        case ThrowTypesList.MISS:
          button.text = 'Miss';
          button.className = 'miss';
          break;

        default:
          break;
      }

      if (key === state.throwState.throwType) {
        button.selected = true;
      }
      if (-1 !== state.throwState.disabledThrowTypes.indexOf(key)) {
        button.disabled = true;
      }

      buttons.push(button);
    }
  }

  return {buttons};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onThrowTypeClick: (id) => {
      dispatch(selectThrowType(id))
    }
  };
};

const ThrowTypesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThrowTypes);

export default ThrowTypesContainer;