'use strict';

var DartGameServer_01 = require('./01/server/DartGame_01'),
    DartHelpers = require('../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;


var game = new DartGameServer_01({
  //variation: 501,
  variation: 31,
  modifiers: {
    limit: 10
  },
  players: {
    2: {"id":2,"firstName":"Matthew","lastName":"Rossetta","displayName":"Matt"},
    3: {"id":3,"firstName":"Emily","lastName":"Ross","displayName":"Em"},
    4: {"id":4,"firstName":"Leonidas","lastName":"Lucas","displayName":"Leo"}
  },
  playerOrder: [3, 4, 2]
});


console.log('');
console.log('========================================');
console.log(`  Welcome to ${game.getDisplayName()}`);
console.log('========================================');
console.log('');

game.startGame();
//console.log(game.getScores());

for (let i = 0, c = 10; i < c; i += 1) {
  let throwData = DartHelpers.Test.generateThrowData();

  console.log(`> threw ${throwData.type}:${21 === throwData.number ? 'BULL' : throwData.number}`);
  game.throwDart(throwData);
  console.log(game.getScores());
  game.advanceGame();
}

//console.log('FINAL GAME STATE');
//console.log(game.getState());




