'use strict';

import {connect} from 'react-redux';
import WidgetWinner from '../../components/WidgetWinner';


const mapStateToProps = (state) => {
  return {
    winner: state.winner,
    playersData: state.players.data
  };
};

const WidgetWinnerContainer = connect(
    mapStateToProps
)(WidgetWinner);

export default WidgetWinnerContainer;