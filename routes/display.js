var express = require('express');
var router = express.Router();

/* GET dispaly home page. */
router.get('/', function(req, res, next) {
    res.render('display/index', {layout: false, title: 'Dart Game Display'});
});

/* Sampel content */
router.get('/content', function(req, res, next) {
    res.render('display/content', {layout: false, title: 'Hello World'});
});

module.exports = router;
