/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */
const http = require('node:http');
const serialization = require("../util/serialization");
/**
 * @typedef {Object} Target
 * @property {string} service
 * @property {string} method
 * @property {Node} node
 */

/**
 * @param {Array} message
 * @param {Target} remote
 * @param {Callback} [callback]
 * @return {void}
 */

function send(message, remote, callback = () => {}) {
    const serializedMsg = serialization.serialize(message);
    let path = `/local/${remote.service}/${remote.method}`;
    if (remote.hasOwnProperty('gid')){ //if remote has gid entry
        path = `/${remote.gid}/${remote.service}/${remote.method}`
    }
    const options = {
        hostname: remote.node.ip,
        port: remote.node.port,
        path: path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(serializedMsg),
        }
    };

    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            try {
                deserializedData = serialization.deserialize(responseData);
            } catch (error) {
                return callback(new Error("Invalid JSON response"));
            }
            if (res.statusCode >= 400) {
                return callback(new Error(`HTTP Error ${res.statusCode}: ${deserializedData}`));
            }
            callback(null, deserializedData);
        });
    });

    req.on('error', (err) => {
        callback(err);
    });
    req.write(serializedMsg);
    req.end();
}

module.exports = { send };