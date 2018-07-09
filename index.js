/*
 * Primary API file
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

// Instantiate the http server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Instantiate the http server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the http server
httpServer.listen(config.httpPort, () => console.log(`${config.envName} mode, port ${config.httpPort}`));

// Start the http server
httpsServer.listen(config.httpsPort, () => console.log(`${config.envName} mode, port ${config.httpsPort}`));

// Server logic for both http and https
const unifiedServer = function (req, res) {
    // Get the full url and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path from that url
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get request headers
    let headers = req.headers;

    // Get the HTTP method
    let method = req.method.toUpperCase();

    // Get the payload
    // handling streams
    let decoder = new stringDecoder('utf-8');
    let buffer = '';

    // On payload
    req.on('data', data => {
        // Add data as it comes in
        buffer += decoder.write(data);
    });

    // On ending
    req.on('end', () => {
        // Finish the last piece of data
        buffer +=  decoder.end();

        // Choose a handler
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        let data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler from the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            // Use the payload called back by the handler or default to empty object
            payload = typeof(payload) === 'object' ? payload : {};

            // Convert object to a string
            let payloadString = JSON.stringify(payload);

            // Set the content-type
            res.setHeader('Content-Type', 'application/json');

            // Return the response
            res.writeHead(statusCode);

            // Send the response
            res.end(payloadString);

            // Log what path the user asked for
            console.log(method, ' Response: ', statusCode, payloadString);
        });
    });
};

// Define a request router
const router = {
    'hello' : handlers.hello,
    'ping' : handlers.ping
};
