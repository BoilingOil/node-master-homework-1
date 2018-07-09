/*
 * Request Handlers
 */

// Define handlers
const handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
    const acceptableMethods = ['POST', 'GET'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._hello[data.method](data, callback);
    } else {
        callback(405);
    }
};

handlers._hello = {};

// Users Post
// Required fields: firstName, lastName, phone, password, tosAgreement: bool
// Optional data: none
handlers._hello.POST = (data, callback) => {
    // Check all required fields are filled out
    const payload = typeof(data.payload.body) === 'string' && data.payload.body.trim().length > 0 ? data.payload.body.trim() : false;

    console.log(data.payload.body);

    if (payload) {
        // Make sure the user doesn't already exist
       callback(200, {'Message' : `Hello, ${payload}!`});
    } else {
        callback(400, {'Error': 'Missing required fields.'});
    }
};

handlers._hello.GET = (data, callback) => {
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