var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//tag::verifyToken[]
const verifyJWT = require('./services/verifyJWT');
app.use(verifyJWT);
//end::verifyToken[]

app.use('/', indexRouter);

module.exports = app;
