var express = require('express'),
    router = express.Router(),
    path = require('path');

/* GET display home page. */
router.get('/', function(req, res, next) {
  res.render('throw/index', {layout: false, title: 'Throw Client'});
});

module.exports = router;
