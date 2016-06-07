var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var order = {order:[['id', 'DESC']]};

    models.Player.findAll(order).then(function(players) {
        models.Dartboard.findAll(order).then(function(dartboards){
            models.Game.findAll(order).then(function(games){
                res.render('admin/admin', {
                    layout: 'admin',
                    title: 'Dart Server Admin',
                    players: players,
                    dartboardTypes: models.Dartboard.rawAttributes.type.values,
                    dartboards: dartboards,
                    games: games
                });
                console.log(models.Dartboard);
            });
        });
    });
});

module.exports = router;
