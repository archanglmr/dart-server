'use strict';
var fs = require('fs'),
    path = require('path'),
    GameInfo = require('./game-info'),
    DartHelpers = require('../dart-helpers');


var actions = require('../../clients/display/actions');

/**
 * This module is in charge of managing the available games, starting a game,
 * restarting a game, and processing throws.
 */
module.exports = class GameManager {
  constructor({gamesPath, models, socket, pauseLength = 5000}) {
    this.games = {};
    this.models = models;
    this.lastGameArgs = null;

    // These are things we'll need to manage the a game once one is started.
    this.activeGame = null;
    this.gamePauseTimer = null;
    this.gamePauseLength = pauseLength;
    this.socket = socket;

    var directories = getDirectories(gamesPath);
    for (let i = 0, c = directories.length; i < c; i += 1) {
      let gameName = directories[i];
      if (gameName) {
        this.games[gameName] = new GameInfo(gameName, path.join(gamesPath, gameName));
      }
    }
  }

  /**
   * Creates a game
   *
   * @param name
   * @param variation
   * @param modifiers
   * @param playerOrder
   * @param randomize
   * @param extras
   * @param seed
   * @returns {boolean} Returns true if the game is valid and we are attempting
   * to create it. Returns false if the game doesn't exists.
   */
  createGame(name, {variation, modifiers, playerOrder, randomize, extras, seed}) {
    if (this.games[name]) {
      this.lastGameArgs = arguments;
      if (randomize) {
        shuffle(playerOrder);
      }

      this.models.Player.findAll({
          where: {id: {in: playerOrder}}
        })
        .then((playerModels) => {
          var players = {};
          for (let i = 0, c = playerModels.length; i < c; i += 1) {
            let player = playerModels[i];
            players[player.id] = player.dataValues;
          }

          // returned via a callback
          this.activeGame = new this.games[name].constructor({
            variation,
            modifiers,
            playerOrder,
            players,
            extras,
            seed
          });
          console.log('Starting ' + this.activeGame.getDisplayName() + ' Game');
          this.activeGame.startGame();
          this.activeGame.runPlugins(() => {
            this.emitGameState();
          });
        });
      return true;
    }
    return false;
  }

  /**
   * Blindly restarts the last game
   */
  restartLastGame() {
    this.createGame.apply(this, this.lastGameArgs);
  }

  /**
   * Builds and returns a list of all the games available
   * @returns {{}}
   */
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

  /**
   * Expects a request and response from an Express like route.
   *
   * @param req
   * @param res
   */
  processThrow(req, res) {
    if ('object' === typeof req.body) {
      res.setHeader('Content-Type', 'application/json');

      if (!this.activeGame) {
        res.status(200);
        res.end();
        return;
      }

      // @todo: this does not check if the game is active or anything
      if (DartHelpers.Test.isValidThrow(req.body)) {
        res.write(JSON.stringify({success: true}));
        res.end();


        if (null === this.gamePauseTimer) {
          let initialState = this.activeGame.getState();

          if (initialState.finished) {
            console.log('game is over, hit MISS to start a new one.');
            if (req.body.type === DartHelpers.ThrowTypes.MISS) {
              console.log('restart game');
              this.restartLastGame();
            } else {
              console.log('ignore throw');
            }
          } else {
            console.log('throw (good):', req.body);
            this.activeGame.throwDart(req.body);
            this.activeGame.runPlugins(() => {
              let state = this.activeGame.getState();

              if (state.game.roundOver) {
                // if the round is over we should send an update, then wait to
                // advance the game
                this.emitGameState();

                if (!state.finished) {
                  this.gamePauseTimer = setTimeout(() => {
                    this.activeGame.advanceGame();
                    this.activeGame.runPlugins(() => {
                      this.emitGameState();
                      this.gamePauseTimer = null;
                    });
                  }, this.gamePauseLength);
                }
              } else {
                // if the round is not over we can update immediately
                this.activeGame.advanceGame();
                this.activeGame.runPlugins(() => {
                  this.emitGameState();
                });
              }
            });
          }


        } else {
          console.log('throw (ignored):', req.body);
        }
      } else if (req.body.undo) {
        if (!this.gamePauseTimer && this.activeGame.undoLastThrow()) {
          this.activeGame.advanceGame();
          this.activeGame.runPlugins(() => {
            this.emitGameState();
            this.gamePauseTimer = null;

            res.write(JSON.stringify({success: true}));
            res.end();
          });
        } else {
          console.log('undo failed');

          res.status(400);
          res.end();
        }
      } else {
        res.write(JSON.stringify({success: false}));
        res.end();
        console.log('throw (bad):', req.body);
      }
    } else {
      res.status(400);
      res.end();
    }
  }

  emitGameState() {
    this.socket.sockets.emit(actions.UPDATE_GAME_STATE, this.activeGame.getState());
  }

  emitUpdateUrl() {
    this.socket.sockets.emit(actions.UPDATE_DISPLAY_URL, {url: '/display/game/' + this.activeGame.getClientDisplayKey()});
  }

  emitShowMenu() {
    this.socket.sockets.emit(actions.GAME_MENU_VISIBILITY, {visible: true});
  }

  emitHideMenu() {
    this.socket.sockets.emit(actions.GAME_MENU_VISIBILITY, {visible: false});
  }
};






function getDirectories(srcpath) {
  return fs
      .readdirSync(srcpath)
      .filter(function(file) { return fs.statSync(path.join(srcpath, file)).isDirectory(); });
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
