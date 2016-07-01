'use strict';

import {connect} from 'react-redux';
import Display from '../../components/Display';


const mapStateToProps = (state) => {
  return {src: state.display};
};

const DisplayContainer = connect(
    mapStateToProps
)(Display);

export default DisplayContainer;