'use strict';

import {connect} from 'react-redux';
import ArcheryTargets from '../../components/ArcheryTargets';


const mapStateToProps = (state) => {
  return {targets: state.game.targets};
};

const ArcheryTargetsContainer = connect(
    mapStateToProps
)(ArcheryTargets);

export default ArcheryTargetsContainer;