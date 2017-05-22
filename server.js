/* Load environment variables from an .env file into process.env; the environment variables loaded are set in the 
Heroku application's Config Variables (MONGOLAB_URI & APP_URL in this app). Use .config() to read the .env file, 
parse the contents, assign it to process.env, & return an Object with a parsed key containing the loaded content 
or an error key if it failed; options are passed to .config() as an Object. */
require('dotenv').config({
    /* Silence dotenv to supress an error. Production environments don't normally have a .env file & thus will 
    print an error to the console, hence the error is suppressed because it isn't relevant. */
    silent: true 
});
// Call the packages needed
var express = require('express'); // Import Express module
// Import the 'path' module to provide utilities for working w/ file & directory paths
var path = require('path'); 
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
/* Set the Entry Point and store it in the var 'routes'. 
-> The Entry Point is the JS file (index.js) that will be invoked when consumers of your 
module 'require()' it (this file includes the main logic for your module). */
var routes = require('./app/routes/index');
var create = require('./app/routes/create');

var app = express(); // Create an Express App

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/urls");

// View Engine setup
/* Use app.set() to assign the 'views' property of the app object to the joined directory name of the current 
module '__dirname' (__dirname is file-metadata in this case) w/ the string 'views'; this sets the directory 
path for the application's views. */
app.set('views', path.join(__dirname, 'views'));
/* Use app.set() to assign the 'view engine' property of the app object to 'jade'; all sub-apps will inherit 
the value of this setting. */
app.set('view engine', 'jade');
    
app.use(express.static(path.join(__dirname, 'public'))); // Set static folder to public directory
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/create', create);

// Catch 404 & forward to Error Handlers below using the next argument & next(err)
app.use(function(req, res, next) {
    var err = new Error ('Not Found');
    err.status = 404;
    next(err);
});

// Error Handlers
// Development Error Handler: Will print stacktrace
/* If the 'env' application setting (a string representing the environment mode) of app's 
GET request is set equal to 'development' execute the Development Error Handler.  */
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        /* Set HTTP status of the response to error object's status property if an error is
        returned by the request; if not set the status to 500. */
        res.status(err.status || 500);
        // Render the error page (error.jade)
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler: No stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    // Render the error page (error.jade)
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/* Access the PORT property in the object containing the user environment by default OR 
use 8080 as the port if default not available. Store result in 'port' variable. */
var port = process.env.PORT || 8080;
app.listen(port, function() {
    // Print message describing what port Node.js is listening on
    console.log('Node.js listening on port ' + port);
});

module.exports = app;

