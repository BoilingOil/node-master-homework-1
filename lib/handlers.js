/*
 * Request Handlers
 */

// Define handlers
const handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
    callback(200, {'Message' : 'Hello!'});
};

// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

// Not found
handlers.notFound = function (data, callback) {
    callback(404);
};

module.exports = handlers;