'use strict';

import {connect} from 'react-redux';
import Heading from '../../components/Heading';


const mapStateToProps = (state) => {
  return {text: state.gameName};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const HeadingContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Heading);

export default HeadingContainer;