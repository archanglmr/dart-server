'use strict';

import {connect} from 'react-redux';
import {submitHit} from '../../throw/actions';
import ThrowButton from '../ThrowButton';


const mapStateToProps = (state, ownProps) => {
  return Object.assign({}, ownProps, {disabled: !state.submitable});
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: () => {
      dispatch(submitHit())
    }
  };
};

const HitSubmitButtonContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ThrowButton);

export default HitSubmitButtonContainer;