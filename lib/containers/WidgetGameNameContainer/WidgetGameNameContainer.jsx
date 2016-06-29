'use strict';

import {connect} from 'react-redux';
import WidgetGameName from '../../components/WidgetGameName';


const mapStateToProps = (state) => {
  // pre-pending '' to prevent warning when game name is a number like 501
  return {text: '' + state.gameName};
};

const WidgetGameNameContainer = connect(
    mapStateToProps
)(WidgetGameName);

export default WidgetGameNameContainer;