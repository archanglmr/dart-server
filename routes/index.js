var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    models.Player.findAll().then(function(players) {
        res.render('index', {
            title: 'Express',
            players: players
        });
    });
});

module.exports = router;
