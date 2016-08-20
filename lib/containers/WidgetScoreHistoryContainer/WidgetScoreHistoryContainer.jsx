'use strict';

import {connect} from 'react-redux';
import WidgetScoreHistory from '../../components/WidgetScoreHistory';


const mapStateToProps = (state) => {
  return {
    history: state.game.players[state.players.current].history,
    roundLimit: state.rounds.limit
  };
};

const WidgetScoreHistoryContainer = connect(
    mapStateToProps
)(WidgetScoreHistory);

export default WidgetScoreHistoryContainer;