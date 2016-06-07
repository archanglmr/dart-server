var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    /* @todo: add search here */

    models.Throw.all()
        .then(function(throws) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(throws), 'utf-8');
            res.end();
        });
});

router.post('/create', function(req, res) {
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

router.get('/:dartThrow_id', function(req, res) {
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

router.get('/:dartThrow_id/destroy', function(req, res) {
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