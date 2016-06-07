var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    /* @todo: add search here */

    models.Game.all()
        .then(function(games) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(games), 'utf-8');
            res.end();
        });
});

router.post('/create', function(req, res) {
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

router.get('/:game_id', function(req, res) {
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

router.get('/:game_id/destroy', function(req, res) {
    models.Game.destroy({
        where: {
            id: req.params.game_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});

module.exports = router;