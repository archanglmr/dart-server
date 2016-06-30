'use strict';

import {connect} from 'react-redux';
import WidgetCricketDisplay from '../../components/WidgetCricketDisplay';


const mapStateToProps = (state) => {
  var players = [],
      targetsOrder = [],
      targets = [];

  for (let i = 0, c = state.players.order.length; i < c; i += 1) {
    let id = state.players.order[i];
    players.push(state.game.players[id]);
  }

  for (let number in state.game.targets) {
    if (state.game.targets.hasOwnProperty(number)) {
      targetsOrder.push(parseInt(number));
    }
  }
  targetsOrder = targetsOrder.sort((a, b) => { return b - a; });

  // special case, we always want 21 (bull) last. we wouldn't want this in
  // hidden cricket though
  if (21 === targetsOrder[0]) {
    targetsOrder.push(targetsOrder.shift());
  }

  for (let i = 0, c = targetsOrder.length; i < c; i += 1) {
    let target = targetsOrder[i];
    targets.push({
      number: target,
      open: state.game.targets[target]
    });
  }

  return {
    //targets: state.game.targets,
    targets,
    players,
    playersDb: state.players
  };
};

const WidgetCricketDisplayContainer = connect(
    mapStateToProps
)(WidgetCricketDisplay);

export default WidgetCricketDisplayContainer;