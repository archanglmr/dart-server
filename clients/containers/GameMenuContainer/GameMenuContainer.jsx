'use strict';

import {connect} from 'react-redux';
import GameMenu from '../../components/GameMenu';


const mapStateToProps = (state) => {
  return {visible: state.menuVisible, menu: state.menu};
};

const GameMenuContainer = connect(
    mapStateToProps
)(GameMenu);

export default GameMenuContainer;