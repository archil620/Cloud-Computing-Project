require('./config/config');     //instantiate configuration variables
require('./global_functions');  //instantiate global functions

console.log("Environment:", CONFIG.app)

const express 		= require('express');
const logger 	    = require('morgan');
const bodyParser 	= require('body-parser');
var cookieParser    = require('cookie-parser');  
const passport      = require('passport');
const path          = require('path');
const myLogger      = require('./services/LoggerService');
const winston       = require('winston');
const flash         = require('connect-flash');
var session         = require('express-session');

const public        = require('./routes/public');

const app = express();

app.use(logger('combined', { "stream": myLogger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(session({ 
    secret: 'fghwj67754wegn456fdy65eujtrh',
    saveUninitialized: true,
    resave: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use for flash messages stored in session

// Register '.mustache' extension with The Mustache Express
//app.engine('mustache', mustacheExpress());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//DATABASE
const models = require("./models");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',CONFIG.db_name, err);
});
if(CONFIG.app==='dev'){
    models.sequelize.sync();//creates table if they do not already exist
    //models.sequelize.sync({ force: true });//deletes all tables then recreates them useful for testing and development purposes
    myLogger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));      
}
// CORS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.use('/', public);

// app.use('/', function(req, res){
// 	res.statusCode = 200;//send the appropriate status code
// 	res.json({status:"success", message:"Parcel Pending API", data:{}})
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;