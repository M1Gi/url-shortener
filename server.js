// Call the packages needed
var express = require('express'); // Import Express module
// Import the 'path' module to provide utilities for working w/ file & directory paths
var path = require('path'); 
// Import MongoDB module & create a new MongoClient instance
var mongo = require('mongodb').MongoClient;
/* Set the Entry Point and store it in the var 'routes'. 
-> The Entry Point is the JS file (index.js) that will be invoked when consumers of your 
module 'require()' it (this file includes the main logic for your module). */
var routes = require('./app/routes/index');
var api = require('./app/api/url-shortener');
require('dotenv').config({
    silent: true
});

var app = express(); // Create an Express App

/* Connect to the database (MongoClient) w/ .connect(); 1st param is ; 2nd param is. */
mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', function(err, db) {
    if (err) {
        throw new Error('Database failed to connect!');
    } else {
        console.log('Successfully connected to MongoDB on port 27017.');
    }
    
    // View Engine setup
    /* Use app.set() to assign the 'views' property of the app object to the joined directory name of the current 
    module '__dirname' (__dirname is file-metadata in this case) w/ the string 'views'; this sets the directory 
    path for the application's views. */
    app.set('views', path.join(__dirname, 'views'));
    /* Use app.set() to assign the 'view engine' property of the app object to 'jade'; all sub-apps will inherit 
    the value of this setting. */
    app.set('view engine', 'jade');
    
    app.use(express.static(path.join(__dirname, 'public'))); // Set static folder to public directory
    
    db.createCollection("sites", {
        capped: true,
        size: 5242880,
        max: 5000
    });
    
    /* Pass the function exported in index.js in the 'routes' dir the express app and db to 
    call the function. */
    routes(app, db);
    /* Pass the function exported in url-shortener.js in the 'api' dir the express app and db 
    to call the function. */
    api(app, db);
    
    /* Access the PORT property in the object containing the user environment by default OR 
    use 8080 as the port if default not available. Store result in 'port' variable. */
    var port = process.env.PORT || 8080;
    app.listen(port, function() {
        // Print message describing what port Node.js is listening on
        console.log('Node.js listening on port ' + port);
    });
});

