'use strict';

import {connect} from 'react-redux';
import WidgetCurrentPlayer from '../../components/WidgetCurrentPlayer';


const mapStateToProps = (state) => {
  return {text: state.players.data[state.players.current].displayName};
};

const WidgetCurrentPlayerContainer = connect(
    mapStateToProps
)(WidgetCurrentPlayer);

export default WidgetCurrentPlayerContainer;