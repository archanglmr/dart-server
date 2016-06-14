'use strict';

import {connect} from 'react-redux';
import {selectHitType, HitTypesList} from '../../throw/actions';
import HitTypes from '../HitTypes';


const mapStateToProps = (state) => {
  let buttons = [];

  for (let key in HitTypesList) {
    if (HitTypesList.hasOwnProperty(key)) {
      let button = {id: key};
      switch(key) {
        case HitTypesList.INNER_SINGLE:
          button.text = 'Inner Single';
          break;

        case HitTypesList.TRIPLE:
          button.text = 'Triple';
          break;

        case HitTypesList.OUTER_SINGLE:
          button.text = 'Outer Single';
          break;

        case HitTypesList.DOUBLE:
          button.text = 'Double';
          break;

        case HitTypesList.MISS:
          button.text = 'Miss';
          break;

        default:
          break;
      }

      if (key === state.hitType) {
        button.selected = true;
      } else if (-1 !== state.disabledHitTypes.indexOf(key)) {
        button.disabled = true;
      }

      buttons.push(button);
    }
  }

  return {buttons};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onHitTypeClick: (id) => {
      dispatch(selectHitType(id))
    }
  };
};

const HitTypesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HitTypes);

export default HitTypesContainer;