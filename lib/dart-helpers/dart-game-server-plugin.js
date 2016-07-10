'use strict';
var dartServerPlugin = require('./dart-game-server/actions').dartServerPlugin;


module.exports = class DartGameServerPlugin {
  /**
   * Boilerplate config setup
   *
   * @param config {{variation: string, modifiers: object, players: Array, playerOrder: Array}}
   */
  constructor(config) {
    // @todo: do whatever you want in your constructor
  }

  run(store, next) {
    console.log('DartGameServerPlugin.run() - timeout');
    var state = store.getState();
    setTimeout(function() {
      console.log('timeout done, dispatch and call next');
      console.log(this.constructor.name);
      console.log('this:', this);
      store.dispatch(dartServerPlugin(this.reducer.bind(this)));
      next();
    }.bind(this), 10);

  }


  reducer(state) {
    console.log('calling custom reducer');
    return Object.assign({}, state, {reduced: 'custom!'});
  }
};
