import React from 'react';
import {render} from 'react-dom';

import {createStore} from 'redux'
import {Provider} from 'react-redux'

//import ThrowButtonContainer from './components/ThrowButtonContainer';
import throwApp from './throw/reducers';

import * as actions from './throw/actions';


//var buttons = [];
//
//for (let i = 21; i > 0; i -=1) {
//  buttons.push({
//    id: i,
//    text: '' + (21 === i ? 'B' : i)
//  })
//}

var store = createStore(throwApp);

let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);


store.dispatch(actions.selectHitType(actions.HitTypes.TRIPLE));
store.dispatch(actions.selectNumber(20));
store.dispatch(actions.selectNumber(21));
store.dispatch(actions.selectNumber(20));
store.dispatch(actions.selectHitType(actions.HitTypes.MISS));
store.dispatch(actions.selectNumber(1));
store.dispatch(actions.selectHitType(actions.HitTypes.MISS));
store.dispatch(actions.selectHitType(actions.HitTypes.INNER_SINGLE));

unsubscribe();
//render(
//  (
//    <Provider store={store}>
//      <ThrowButtonContainer buttons={buttons} />
//    </Provider>
//  ),
//  document.getElementById('root')
//);