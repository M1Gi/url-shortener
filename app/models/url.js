var mongoose = require('mongoose');
mongoose.Promise = Promise;

var URLSchema = mongoose.Schema({
    URL: String,
    number: Number
});

var URL = module.exports = mongoose.model('URL', URLSchema);

module.exports.saveURL = function(newURL, callback) {
    newURL.save(callback);
};

module.exports.findAll = function(query, callback) {
    URL.find(query, callback);
};
