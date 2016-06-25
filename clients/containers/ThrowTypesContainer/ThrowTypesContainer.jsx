'use strict';

import {connect} from 'react-redux';
import {selectThrowType, ThrowTypesList} from '../../throw/actions';
import ThrowTypes from '../../components/ThrowTypes';


const mapStateToProps = (state) => {
  let buttons = [];

  for (let key in ThrowTypesList) {
    if (ThrowTypesList.hasOwnProperty(key)) {
      let button = {id: key};
      switch(key) {
        case ThrowTypesList.SINGLE_INNER:
          button.text = 'Inner Single';
          break;

        case ThrowTypesList.TRIPLE:
          button.text = 'Triple';
          break;

        case ThrowTypesList.SINGLE_OUTER:
          if (21 === state.throwNumber) {
            button.text = 'Outer';
          } else {
            button.text = 'Outer Single';
          }
          break;

        case ThrowTypesList.DOUBLE:
          button.text = 'Double';
          break;

        case ThrowTypesList.MISS:
          button.text = 'Miss';
          break;

        default:
          break;
      }

      if (key === state.throwType) {
        button.selected = true;
      }
      if (-1 !== state.disabledThrowTypes.indexOf(key)) {
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