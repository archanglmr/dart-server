'use strict';

module.exports = (io) => {
  var models = require('../models'),
      express = require('express'),
      router = express.Router(),
      DartHelpers = require('../lib/dart-helpers'),
      FilterTypes = DartHelpers.State.FilterTypes,
      actions = require('../clients/display/actions'),
      GameManager = require('../lib/game-manager');

   var gm = new GameManager({
        gamesPath: __dirname + '/../games',
        models,
        socket: io
      });


  /**
   * socket.io server
   */
  io.on('connection', (socket) => {
    console.log('A client connected');
    if (gm && gm.activeGame) {
      gm.emitUpdateUrl();
      gm.emitGameState();
      gm.emitGameMenu();
    } else {
      console.log('game not ready');
    }

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });



  /**
   * player order by id (unless you pass randomize: true)
   */
  var playerOrder = [12, 15], //15
      randomize = true;

  /**
   * Games we can play
   */
  //gm.createGame('01', {variation: 301, playerOrder, randomize});
  //gm.createGame('01', {variation: 501, playerOrder, randomize});
  //gm.createGame('01', {variation: 501, playerOrder, randomize, modifiers: {split_bull: true}});
  //gm.createGame('01', {variation: 141, playerOrder, randomize, extras: { location: "192.168.1.137", port: 8888, endpoint: 'windicator', extraArgs: {limit:10}}});
  //gm.createGame('01', {variation: 50, playerOrder, randomize, extras: { location: "localhost", port: 8888, endpoint: 'windicator', extraArgs: {limit:10}}});
  //gm.createGame('01', {variation: 50, playerOrder, randomize, modifiers: {limit: 2}});

  //gm.createGame('archery', {playerOrder, randomize});
  //gm.createGame('archery', {playerOrder, randomize, modifiers: {limit: 2}});

  //gm.createGame('count_up', {playerOrder, randomize});

  gm.createGame('cricket', {playerOrder, randomize});
  //gm.createGame('cricket', {playerOrder, randomize, modifiers: {filter: FilterTypes.TRIPLES, limit: 0}});
  //gm.createGame('cricket', {variation: 'Closeout', playerOrder, randomize});
  //gm.createGame('cricket', {variation: 'Closeout', playerOrder, randomize, modifiers: {filter: FilterTypes.TRIPLES, limit: 20}});
  //gm.createGame('cricket', {variation: 'Closeout', playerOrder, randomize, modifiers: {targets: 'random', filter: FilterTypes.MASTERS}});
  //gm.createGame('cricket', {playerOrder, randomize, modifiers: {limit: 2}});
  //gm.createGame('cricket', {playerOrder, randomize, modifiers: {targets: 'random'}});

  //gm.createGame('gotcha', {playerOrder, randomize});
  //gm.createGame('gotcha', {playerOrder, randomize, modifiers: {split_bull: true}});
  //gm.createGame('gotcha', {playerOrder, randomize, modifiers: {limit: 4}});
  //gm.createGame('gotcha', {playerOrder, randomize, extras: { location: "192.168.1.137", port: 8888, endpoint: 'windicator', extraArgs: {limit:10}}});

  //gm.createGame('jump_up', {playerOrder, randomize});
  // gm.createGame('jump_up', {variation: 'Hyper', playerOrder, randomize});

  //gm.createGame('shanghai', {modifiers: {limit: 7}, playerOrder, randomize});
  //gm.createGame('shanghai', {modifiers: {limit: 2}, playerOrder, randomize});

  //gm.createGame('slider', {playerOrder, randomize});
  //gm.createGame('slider', {playerOrder, randomize, modifiers: {filter: FilterTypes.MASTERS}});
  //gm.createGame('slider', {playerOrder, randomize, modifiers: {bull_required: true}});
  //gm.createGame('slider', {playerOrder, randomize, modifiers: {bull_required: true, filter: FilterTypes.SINGLE_INNER}});
  //gm.createGame('slider', {playerOrder, randomize, modifiers: {bull_required: true, filter: FilterTypes.MASTERS}});
  //gm.createGame('slider', {playerOrder, randomize, modifiers: {limit: 2}});

  //gm.createGame('tug_o_war', {playerOrder, randomize});
  //gm.createGame('tug_o_war', {playerOrder, randomize, modifiers: {bull_multiplier: true}, extras: {handicap: {2: .5, 3: 1.5}}});

  //gm.createGame('warfare', {playerOrder, randomize});
  //gm.createGame('warfare', {playerOrder, randomize, modifiers: {limit: 2}});






  /**
   * Throw handler for "throw client"
   */
  router.post('/throw', gm.processThrow.bind(gm));
  router.post('/menu', gm.processMenuKey.bind(gm));


  router.get('/gameoptions', function (req, res) {
    var games = gm.listGames();

    models.Player.all()
        .then((players) => {
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
