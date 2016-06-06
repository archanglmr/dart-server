var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //models.User.findAll({
    //    include: [ models.Task ]
    //}).then(function(users) {
    //    console.log('index users:');
    //    console.log(users);
    //    res.render('index', {
    //        title: 'Express',
    //        users: users
    //    });
    //});
    res.render('index', { title: 'Express' });
});

module.exports = router;
