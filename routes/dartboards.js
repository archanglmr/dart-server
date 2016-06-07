var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    /* @todo: add search here */

    models.Dartboard.all()
        .then(function(dartboards) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(dartboards), 'utf-8');
            res.end();
        });
});

router.post('/create', function(req, res) {
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

router.get('/:dartboard_id', function(req, res) {
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

router.get('/:dartboard_id/destroy', function(req, res) {
    models.Dartboard.destroy({
        where: {
            id: req.params.dartboard_id
        }
    }).then(function() {
        res.status(204).send('No Content');
        res.end();
    });
});

module.exports = router;