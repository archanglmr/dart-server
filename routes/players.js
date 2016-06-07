var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    /* @todo: add search here */

    models.Player.all()
        .then(function(players) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(players), 'utf-8');
            res.end();
        });
});

router.post('/create', function(req, res) {
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

router.get('/:player_id', function(req, res) {
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

router.get('/:player_id/destroy', function(req, res) {
    models.Player.destroy({
        where: {
            id: req.params.player_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});

module.exports = router;