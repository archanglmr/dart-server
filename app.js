var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config');


var app = express();
var compiler = webpack(config);


app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config[0].output.publicPath }));
app.use(webpackHotMiddleware(compiler));


// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/', require('./routes/index'));
app.use('/display', require('./routes/display'));
app.use('/throw', require('./routes/throw'));
//app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

app.use('/builds', express.static('builds'));


// error handling got moved to the bin/www file because we need to do some stuff
// before it.




module.exports = app;
