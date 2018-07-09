/*
 * Helpers
 */

// Create Container
const helpers = {};

// Parse a JSON string to an object in all cases without throwing
helpers.parseJsonToObject = (string) => {
    try {
        return JSON.parse(string);
    } catch(e) {
        return {}
    }
};

module.exports = helpers;