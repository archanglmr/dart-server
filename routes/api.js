var models  = require('../models');
var express = require('express');
var router = express.Router();


/**
 * Dartboard scaffolding
 */
router.get('/dartboards', function(req, res) {
    /* @todo: add search here */

    models.Dartboard.all()
        .then(function(dartboards) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(dartboards), 'utf-8');
            res.end();
        });
});

router.post('/dartboards/create', function(req, res) {
    models.Dartboard.create({
        name: req.body.name,
        type: req.body.type,
        location: req.body.location,
        description: req.body.description
    }).then(function(dartboard) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(dartboard), 'utf-8');
        //res.redirect(dartboard.id);
    });
});

router.get('/dartboards/:dartboard_id', function(req, res) {
    models.Dartboard.findById(req.params.dartboard_id)
        .then(function(dartboard) {
            if (dartboard) {
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(dartboard), 'utf-8');
            } else {
                res.status(404).send('Not found');
            }
            res.end();
        });
});

router.get('/dartboards/:dartboard_id/destroy', function(req, res) {
    models.Dartboard.destroy({
        where: {
            id: req.params.dartboard_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});


/**
 *  Game scaffolding
 */
router.get('/games', function(req, res) {
    /* @todo: add search here */

    models.Game.all()
        .then(function(games) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(games), 'utf-8');
            res.end();
        });
});

router.post('/games/create', function(req, res) {
    models.Game.create({
        name: req.body.name,
        type: req.body.type,
        variation: req.body.variation,
        modifiers: req.body.modifiers,
        signature: req.body.signature,
        players: req.body.players,
        data: req.body.data,
        log: req.body.log
    }).then(function(game) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(game), 'utf-8');
        //res.redirect(game.id);
    });
});

router.get('/games/:game_id', function(req, res) {
    models.Game.findById(req.params.game_id)
        .then(function(game) {
            if (game) {
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(game), 'utf-8');
            } else {
                res.status(404).send('Not found');
            }
            res.end();
        });
});

router.get('/games/:game_id/destroy', function(req, res) {
    models.Game.destroy({
        where: {
            id: req.params.game_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});


/**
 *  Players scaffolding
 */
router.get('/players', function(req, res) {
    /* @todo: add search here */

    models.Player.all()
        .then(function(players) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(players), 'utf-8');
            res.end();
        });
});

router.post('/players/create', function(req, res) {
    models.Player.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        displayName: req.body.displayName
    }).then(function(player) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(player), 'utf-8');
        //res.redirect(player.id);
    });
});

router.get('/players/:player_id', function(req, res) {
    models.Player.findById(req.params.player_id)
        .then(function(player) {
            if (player) {
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(player), 'utf-8');
            } else {
                res.status(404).send('Not found');
            }
            res.end();
        });
});

router.get('/players/:player_id/destroy', function(req, res) {
    models.Player.destroy({
        where: {
            id: req.params.player_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});


/**
 * Throws scaffolding
 */
router.get('/throws', function(req, res) {
    /* @todo: add search here */

    models.Throw.all()
        .then(function(throws) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(throws), 'utf-8');
            res.end();
        });
});

router.post('/throws/create', function(req, res) {
    models.Throw.create({
        leg: req.body.leg,
        round: req.body.round,
        section: req.body.section,
        number: req.body.number,
        points: req.body.points,
        GameId: req.body.GameId,
        PlayerId: req.body.PlayerId
    }).then(function(dartThrow) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(dartThrow), 'utf-8');
        //res.redirect(dartThrow.id);
    });
});

router.get('/throws/:dartThrow_id', function(req, res) {
    models.Throw.findById(req.params.dartThrow_id)
        .then(function(dartThrow) {
            if (dartThrow) {
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(dartThrow), 'utf-8');
            } else {
                res.status(404).send('Not found');
            }
            res.end();
        });
});

router.get('/throws/:dartThrow_id/destroy', function(req, res) {
    models.Throw.destroy({
        where: {
            id: req.params.dartThrow_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});


module.exports = router;