var express = require('express'),
    router = express.Router(),
    path = require('path');

/* GET client home page. */
router.get('/', function(req, res, next) {
    res.render('client/index', {layout: false, title: 'Dart Game Display'});
});

/* Sample content */
router.get('/content', function(req, res, next) {
    res.render('client/content', {layout: false, title: 'Hello World'});
});


router.use('/assets', express.static(path.join(__dirname, '../builds/client')));

module.exports = router;
