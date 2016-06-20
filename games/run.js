'use strict';

var DartGameServer_01 = require('./01/server/DartGame_01'),
    DartHelpers = require('../lib/dart-helpers'),
    ThrowTypes = DartHelpers.ThrowTypes;


var game = new DartGameServer_01({
  //variation: 501,
  variation: 31,
  modifiers: {
    limit: 30
  },
  players: {
    2: {"id":2,"firstName":"Matt","lastName":"Rossetta","displayName":"Matt Rossetta"},
    3: {"id":3,"firstName":"Em","lastName":"Ross","displayName":"Lovie"},
    4: {"id":4,"firstName":"Leo","lastName":"Lucas","displayName":"Mr Leo"}
  },
  playerOrder: [3, 4, 2]
});


console.log('');
console.log('========================================');
console.log(`  Welcome to ${game.getDisplayName()}`);
console.log('========================================');
console.log('');

game.startGame();

for (let i = 0, c = 5; i < c; i += 1) {
  let throwData = DartHelpers.Test.generateThrowData();

  console.log(`> threw ${throwData.type}:${throwData.number}`);
  game.throwDart(throwData);
  console.log(game.getScores());
  game.advanceGame();
}

//console.log('FINAL GAME STATE');
//console.log(game.getState());




