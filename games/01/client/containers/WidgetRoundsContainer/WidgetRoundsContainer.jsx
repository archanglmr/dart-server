'use strict';

import {connect} from 'react-redux';
import WidgetRounds from '../../components/WidgetRounds';


const mapStateToProps = (state) => {
  return {
    current: state.rounds.current + 1,
    limit: state.rounds.limit,
  };
};

const WidgetRoundsContainer = connect(
    mapStateToProps
)(WidgetRounds);

export default WidgetRoundsContainer;