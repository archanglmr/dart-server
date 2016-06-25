'use strict';

import {connect} from 'react-redux';
import Heading from '../../components/Heading';


const mapStateToProps = (state) => {
  // pre-pending '' to prevent warning when game name is a number like 501
  return {text: '' + state.gameName};
};

const HeadingContainer = connect(
    mapStateToProps
)(Heading);

export default HeadingContainer;