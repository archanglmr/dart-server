'use strict';

import {connect} from 'react-redux';
import {submitThrow} from '../../throw/actions';
import ThrowButton from '../ThrowButton';


const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {disabled: !state.submittable});
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