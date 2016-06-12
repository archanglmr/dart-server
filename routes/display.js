var express = require('express'),
    router = express.Router(),
    path = require('path');

/* GET display home page. */
router.get('/', function(req, res, next) {
  res.render('display/index', {layout: false, title: 'Dart Game Display'});
});

/* Sample content */
router.get('/content', function(req, res, next) {
  res.render('display/content', {layout: false, title: 'Hello World'});
});

module.exports = router;
