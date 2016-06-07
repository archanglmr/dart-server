var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    models.Player.all().then(function(players) {
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
        res.redirect(player.id);
    });
});

router.get('/:player_id/destroy', function(req, res) {
    models.Player.destroy({
        where: {
            id: req.params.player_id
        }
    }).then(function() {
        res.redirect('/');
    });
});

module.exports = router;