'use strict';

import {connect} from 'react-redux';
import WidgetPlayerList from '../../components/WidgetPlayerList';


const mapStateToProps = (state) => {
  var players = [];
  for (let i = 0, c = state.players.order.length; i < c; i += 1) {
    let id = state.players.order[i],
        player = state.players.data[id];

    player.meta = Object.assign({}, state.game.players[id]);
    player.score = state.game.players[id].score;
    player.current = (state.players.current === id);

    players.push(player);
  }


  return {players};
};

const WidgetPlayerListContainer = connect(
    mapStateToProps
)(WidgetPlayerList);

export default WidgetPlayerListContainer;