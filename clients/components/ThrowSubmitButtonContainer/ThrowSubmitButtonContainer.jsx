'use strict';

import {connect} from 'react-redux';
import {submitThrow} from '../../throw/actions';
import ThrowButton from '../ThrowButton';


const mapStateToProps = (state, ownProps) => {
  let newProps = {disabled: (!state.submittable || state.isSubmitting)};
  if (state.isSubmitting) {
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