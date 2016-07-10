'use strict';

module.exports = (io) => {
  var models = require('../models'),
      express = require('express'),
      router = express.Router(),
      DartHelpers = require('../lib/dart-helpers'),
      actions = require('../clients/display/actions'),
      GameManager = require('../lib/game-manager');

  var gamePauseLength = 3000,
      gamePauseTimer = null,
      game = null, // this will be populated with whatever game
      gameStarted = function(g) {
        game = g;
        console.log('Starting ' + game.getDisplayName() + ' Game');
        game.startGame();
        io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));
      },
      gm = new GameManager(__dirname + '/../games', models, gameStarted);


  /**
   * player order by id (unless you pass randomize: true)
   */
  var playerOrder = [4, 2],
      randomize = true;

  /**
   * Games we can play
   */
  gm.createGame('01', {variation: 501, playerOrder, randomize});
  //gm.createGame('01', {variation: 50, playerOrder, randomize, extras: { location: "localhost", port: 8888, endpoint: 'windicator', extraArgs: {limit:10}}});
  //gm.createGame('01', {variation: 50, playerOrder, randomize});
  //gm.createGame('archery', {playerOrder, randomize});
  //gm.createGame('cricket', {playerOrder, randomize});
  //gm.createGame('cricket', {variation: 'Closeout', playerOrder, randomize, modifiers: {limit: 18}});
  //gm.createGame('shanghai', {modifiers: {limit: 7}, playerOrder, randomize});
  //gm.createGame('slider', {playerOrder, randomize});
  //gm.createGame('warfare', {playerOrder, randomize});




  /**
   * socket.io server
   */
  io.on('connection', function(socket) {
    console.log('A client connected');
    if (game) {
      socket.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));
    } else {
      console.log('game not ready');
    }

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });


  /**
   * Throw handler for "throw client"
   */
  router.post('/throw', function (req, res) {
    var data = req.body;

    if ('object' == typeof req.body) {
      res.setHeader('Content-Type', 'application/json');

      if (!game) {
        res.status(200);
        res.end();
        return;
      }

      // @todo: this does not check if the game is active or anything
      if (DartHelpers.Test.isValidThrow(req.body)) {
        res.write(JSON.stringify({success: true}));
        res.end();


        if (null === gamePauseTimer) {
          console.log('throw (good):', data);
          game.throwDart(req.body);
          game.runPlugins(() => {
            let state = game.getState();

            if (state.game.roundOver) {
              // if the round is we should send an update, then wait to advance
              // the game
              io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));

              gamePauseTimer = setTimeout(() => {
                game.advanceGame();
                game.runPlugins(() => {
                  io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));
                  gamePauseTimer = null;
                });
              }, gamePauseLength);
            } else {
              // if the round is not over we can update immediately
              game.advanceGame();
              game.runPlugins(() => {
                io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));
              });
            }
          });


        } else {
          console.log('throw (ignored):', data);
        }
      } else if (req.body.undo) {
        if (!gamePauseTimer && game.undoLastThrow()) {
          game.advanceGame();
          game.runPlugins(() => {
            io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game));
            gamePauseTimer = null;

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
        console.log('throw (bad):', data);
      }
      res.end();
    } else {
      res.status(400);
      res.end();
    }
  });


  /**
   * @todo: This helper could be planned out a bit better....
   *
   * @param game {DartGameServer}
   * @param state {object}
   * @returns {{display: string, state: *}}
   */
  function io_response_wrapper(game) {
    return {
      display: '/display/game/' + game.getClientDisplayKey(),
      state: game.getState()
    };
  }

  router.get('/gameoptions', function (req, res) {
    var games = gm.listGames();

    models.Player.all()
        .then(function (players) {
          // @fixme: dumping to much player info here???
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify({games, players}), 'utf-8');
          res.end();
        });
  });




















  /**
   * Dartboard scaffolding
   */
  router.get('/dartboards', function (req, res) {
    /* @todo: add search here */

    models.Dartboard.all()
        .then(function (dartboards) {
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(dartboards), 'utf-8');
          res.end();
        });
  });

  router.post('/dartboards/create', function (req, res) {
    models.Dartboard.create({
      name: req.body.name,
      type: req.body.type,
      location: req.body.location,
      description: req.body.description
    }).then(function (dartboard) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(dartboard), 'utf-8');
      //res.redirect(dartboard.id);
    });
  });

  router.get('/dartboards/:dartboard_id', function (req, res) {
    models.Dartboard.findById(req.params.dartboard_id)
        .then(function (dartboard) {
          if (dartboard) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(dartboard), 'utf-8');
          } else {
            res.status(404).send('Not found');
          }
          res.end();
        });
  });

  router.get('/dartboards/:dartboard_id/destroy', function (req, res) {
    models.Dartboard.destroy({
      where: {
        id: req.params.dartboard_id
      }
    }).then(function () {
      res.status(204).send('No Content');
      res.end();
    });
  });


  /**
   *  Game scaffolding
   */
  router.get('/games', function (req, res) {
    /* @todo: add search here */

    models.Game.all()
        .then(function (games) {
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(games), 'utf-8');
          res.end();
        });
  });

  router.post('/games/create', function (req, res) {
    models.Game.create({
      name: req.body.name,
      type: req.body.type,
      variation: req.body.variation,
      modifiers: req.body.modifiers,
      signature: req.body.signature,
      players: req.body.players,
      data: req.body.data,
      log: req.body.log
    }).then(function (game) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(game), 'utf-8');
      //res.redirect(game.id);
    });
  });

  router.get('/games/:game_id', function (req, res) {
    models.Game.findById(req.params.game_id)
        .then(function (game) {
          if (game) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(game), 'utf-8');
          } else {
            res.status(404).send('Not found');
          }
          res.end();
        });
  });

  router.get('/games/:game_id/destroy', function (req, res) {
    models.Game.destroy({
      where: {
        id: req.params.game_id
      }
    }).then(function () {
      res.status(204).send('No Content');
      res.end();
    });
  });


  /**
   *  Players scaffolding
   */
  router.get('/players', function (req, res) {
    /* @todo: add search here */

    models.Player.all()
        .then(function (players) {
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(players), 'utf-8');
          res.end();
        });
  });

  router.post('/players/create', function (req, res) {
    models.Player.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      displayName: req.body.displayName
    }).then(function (player) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(player), 'utf-8');
      //res.redirect(player.id);
    });
  });

  router.get('/players/:player_id', function (req, res) {
    models.Player.findById(req.params.player_id)
        .then(function (player) {
          if (player) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(player), 'utf-8');
          } else {
            res.status(404).send('Not found');
          }
          res.end();
        });
  });

  router.get('/players/:player_id/destroy', function (req, res) {
    models.Player.destroy({
      where: {
        id: req.params.player_id
      }
    }).then(function () {
      res.status(204).send('No Content');
      res.end();
    });
  });


  /**
   * Throws scaffolding
   */
  router.get('/throws', function (req, res) {
    /* @todo: add search here */

    models.Throw.all()
        .then(function (throws) {
          res.setHeader('Content-Type', 'application/json');
          res.write(JSON.stringify(throws), 'utf-8');
          res.end();
        });
  });

  router.post('/throws/create', function (req, res) {
    models.Throw.create({
      leg: req.body.leg,
      round: req.body.round,
      section: req.body.section,
      number: req.body.number,
      points: req.body.points,
      GameId: req.body.GameId,
      PlayerId: req.body.PlayerId
    }).then(function (dartThrow) {
      res.setHeader('Content-Type', 'application/json');
      res.write(JSON.stringify(dartThrow), 'utf-8');
      //res.redirect(dartThrow.id);
    });
  });

  router.get('/throws/:dartThrow_id', function (req, res) {
    models.Throw.findById(req.params.dartThrow_id)
        .then(function (dartThrow) {
          if (dartThrow) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(dartThrow), 'utf-8');
          } else {
            res.status(404).send('Not found');
          }
          res.end();
        });
  });

  router.get('/throws/:dartThrow_id/destroy', function (req, res) {
    models.Throw.destroy({
      where: {
        id: req.params.dartThrow_id
      }
    }).then(function () {
      res.status(204).send('No Content');
      res.end();
    });
  });

  return router;
};

//module.exports = router;
