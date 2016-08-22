'use strict';

import {connect} from 'react-redux';
import WidgetCurrentPPD from '../../components/WidgetCurrentPPD';


const mapStateToProps = (state) => {
  return {ppd: state.game.players[state.players.current].ppd};
};

const WidgetCurrentPPDContainer = connect(
    mapStateToProps
)(WidgetCurrentPPD);

export default WidgetCurrentPPDContainer;