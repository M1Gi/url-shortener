var express = require('express');
var router = express.Router();
var URL = require('../models/url');

/* Create short_url & display the object w/ the original_url & short_url to the user:
-> Example: https://urlshort.herokuapp.com/new/http://google.com <- Actual Site Passed 
The route '/new/:url*' corresponds to '/new/http://google.com' 
The * tells .get() to accept everything after '/new/' regardless of how it is formatted because 
if the user passes an 'http://' address, the double slashes will normally be interpreted as going
to a folder path; hence the asterisk allows accepting the entire string address incl 'http://'.
Return an instance of the full URL passed by the user, and run a callback function on it. */
router.get('/*?', function(req, res, next) { // Create short url, store & display the info

    if (validateURL(req.params[0])) {
        var numDocs = 0;
        URL.findAll({}, function(err, docs) {
            if (err) throw err;
            numDocs = docs.length + 1;
            var newURL = new URL({
                URL: req.params[0],
                number: numDocs
            });
            URL.saveURL(newURL, function(err, data) {
                if (err) throw err;
            });
            res.json({ 
                "original_url": req.params[0], 
                "short_url": process.env.APP_URL + numDocs
            });
        });
    } else {
        res.json({ "error": "This is not a valid URL. Please try again." });
    }
    // Create a function to check if the URL passed by the user is an valid URL & return a Boolean
    function validateURL(url) {
        // Checks to see if it is an actual URL
        var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
        return regex.test(url); // Compare the url to the regex of valid urls and return TRUE for a match OR FALSE otherwise
    }
});

module.exports = router;




