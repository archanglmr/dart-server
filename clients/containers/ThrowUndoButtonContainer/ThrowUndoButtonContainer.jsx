'use strict';

import {connect} from 'react-redux';
import {submitUndo} from '../../throw/actions-throw-state';
import ThrowButton from '../../components/ThrowButton';


const mapStateToProps = (state, ownProps) => {
  let newProps = {disabled: state.throwState.isSubmitting};
  if (state.throwState.isSubmitting) {
    newProps.text = 'Undoing...';
  }
  return Object.assign({}, ownProps, newProps);
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(submitUndo())
    }
  };
};

const ThrowUndoButtonContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThrowButton);

export default ThrowUndoButtonContainer;