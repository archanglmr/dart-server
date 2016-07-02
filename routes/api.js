'use strict';

module.exports = (io) => {
  var models = require('../models'),
      express = require('express'),
      router = express.Router(),
      DartHelpers = require('../lib/dart-helpers'),
      actions = require('../clients/display/actions'),


      players = {
        2: {
          "id": 2,
          "firstName": "Matthew",
          "lastName": "Rossetta",
          "displayName": "Matt"
        },
        3: {
          "id": 3,
          "firstName": "Emily",
          "lastName": "Ross",
          "displayName": "Em"
        },
        4: {
          "id": 4,
          "firstName": "Leonidas",
          "lastName": "Lucas",
          "displayName": "Leo"
        },
        5: {
          "id": 5,
          "firstName": "Dennis",
          "lastName": "De Cristo",
          "displayName": "Dennis"
        },
        6: {
          "id": 6,
          "firstName": "Jerry",
          "lastName": "Dwelle",
          "displayName": "Jerry"
        }
      },
      playerOrder = [2, 4];


  //var DartGameServer_Shanghai = require(__dirname + '/../games/shanghai/server/DartGameServer_Shanghai'),
  //    game = new DartGameServer_Shanghai({
  //      modifiers: {
  //        limit: 7 // innings
  //      },
  //      players,
  //      playerOrder
  //    });

  //var DartGameServer_Cricket = require(__dirname + '/../games/cricket/server/DartGameServer_Cricket'),
  //    game = new DartGameServer_Cricket({
  //      variation: 'standard',
  //      modifiers: {
  //        limit: 25
  //      },
  //      players,
  //      playerOrder
  //    });

  var DartGameServer_01 = require(__dirname + '/../games/01/server/DartGameServer_01'),
      game = new DartGameServer_01({
        variation: 501,
        //modifiers: {
        //  limit: 25
        //},
        players,
        playerOrder
      });


  var gamePauseLength = 3000,
      gamePauseTimer = null;

  console.log('Starting ' + game.getDisplayName() + ' Game');
  game.startGame();

  /**
   * socket.io server
   */
  io.on('connection', function(socket) {
    console.log('A client connected');
    socket.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game.getState()));

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

      // @todo: this does not check if the game is active or anything
      if (DartHelpers.Test.isValidThrow(req.body)) {
        res.write(JSON.stringify({success: true}));


        if (null === gamePauseTimer) {
          console.log('throw (good):', data);
          game.throwDart(req.body);
          //console.log(DartHelpers.Test.widgetThrows(game.getState()));
          //console.log(game.getScores());
          let state = game.getState();

          if (state.game.roundOver) {
            // if the round is we should send an update, then wait to advance
            // the game
            io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(state));

            gamePauseTimer = setTimeout(() => {
              game.advanceGame();
              //console.log(DartHelpers.Test.widgetThrows(game.getState()));
              //console.log(game.getScores());
              io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game.getState()));
              gamePauseTimer = null;
            }, gamePauseLength);
          } else {
            // if the round is not over we can update immediately
            game.advanceGame();
            //console.log(DartHelpers.Test.widgetThrows(game.getState()));
            //console.log(game.getScores());
            io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game.getState()));
          }

        } else {
          console.log('throw (ignored):', data);
        }
      } else if (req.body.undo) {
        if (!gamePauseTimer && game.undoLastThrow()) {
          game.advanceGame();
          //console.log(DartHelpers.Test.widgetThrows(game.getState()));
          //console.log(game.getScores());
          io.sockets.emit(actions.UPDATE_GAME_STATE, io_response_wrapper(game.getState()));
          gamePauseTimer = null;

          res.write(JSON.stringify({success: true}));
        } else {
          console.log('undo failed');

          res.status(400);
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
   * @param state
   * @returns {{display: string, state: *}}
   */
  function io_response_wrapper(state) {
    return {
      display: '/display/game/' + game.getClientDisplayKey(),
      state: state
    };
  }





















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