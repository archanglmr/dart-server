'use strict';

import {connect} from 'react-redux';
import {submitThrow} from '../../throw/actions-throw-state';
import ThrowButton from '../../components/ThrowButton';


const mapStateToProps = (state, ownProps) => {
  let newProps = {disabled: (!state.throwState.submittable || state.throwState.isSubmitting)};
  if (state.throwState.isSubmitting) {
    newProps.text = 'Submitting...';
  }
  return Object.assign({}, ownProps, newProps);
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(submitThrow())
    }
  };
};

const ThrowSubmitButtonContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThrowButton);

export default ThrowSubmitButtonContainer;