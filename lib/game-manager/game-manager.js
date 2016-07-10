'use strict';
var fs = require('fs'),
    path = require('path'),
    GameInfo = require('./game-info');


/**
 * This module is in charge of managing the available games. It is not in charge
 * of broadcasting the state
 */
module.exports = class GameManager {
  constructor(gamesPath, models, gameCreatedCallback) {
    this.games = {};
    this.models = models;
    this.gameCreatedCallback = gameCreatedCallback || (() => {});
    var directories = getDirectories(gamesPath);
    for (let i = 0, c = directories.length; i < c; i += 1) {
      let gameName = directories[i];
      if (gameName) {
        this.games[gameName] = new GameInfo(gameName, path.join(gamesPath, gameName));
      }
    }
  }

  createGame(name, {variation, modifiers, playerOrder, randomize, extras}) {
    if (this.games[name]) {
      if (randomize) {
        shuffle(playerOrder);
      }

      this.models.Player.findAll({
          where: {id: {in: playerOrder}}
        })
        .then(function (playerModels) {
          var players = {};
          for (let i = 0, c = playerModels.length; i < c; i += 1) {
            let player = playerModels[i];
            players[player.id] = player.dataValues;
          }

          // returned via a callback
          this.gameCreatedCallback(new this.games[name].constructor({
            variation,
            modifiers,
            playerOrder,
            players,
            extras
          }));
        }.bind(this));
      return true;
    }
    return false;
  }

  listGames() {
    var games = {};

    for(let name in this.games) {
      if (this.games.hasOwnProperty(name)) {
        let gameInfo = this.games[name];
        games[name] = gameInfo.getInfo();
      }
    }

    return games;
  }
};






function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
