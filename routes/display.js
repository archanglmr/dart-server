var express = require('express'),
    router = express.Router(),
    path = require('path');

/* GET display home page. */
router.get('/', function(req, res, next) {
  res.render('display/index', {layout: false, title: 'Dart Game Display'});
});

/* Game content */
router.get('/game/:game', function(req, res, next) {
  // @fixme This is not secure because req.params.game is not being validated
  res.render('display/content', {
    layout: false,
    game: req.params.game,
    title: req.params.game
  });
});

///* Sample content */
//router.get('/content', function(req, res, next) {
//  res.render('display/content', {layout: false, title: 'Hello World'});
//});

module.exports = router;
