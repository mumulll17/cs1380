/** @typedef {import("../types").Callback} Callback */
/** @typedef {import("../types").Node} Node */
const distribution = require("@brown-ds/distribution");
const http = require('node:http');
const serialization = require('../util/serialization');
const log = require('../util/log.js');
// const serialize = distribution.util.serialize;
// const deserialize = distribution.util.deserialize;
// const { deserialize } = require("node:v8");
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
    // console.log(1111222);
    if (typeof callback != 'function'){
        log(JSON.stringify(callback),"inlocalcommsend");
    }
    const serializedMsg = serialization.serialize(message);
    let path = `/local/${remote.service}/${remote.method}`;
    if (remote.hasOwnProperty('gid')){ //if remote has gid entry
        console.log(1);
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
    // console.log('before sending request');
    const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            // try {
            let deserializedData = serialization.deserialize(responseData);
            // console.log(deserializedData);
            // } catch (error) {
            //     return callback(new Error("Invalid JSON response"));
            // }
            // if (res.statusCode >= 400) {
            //     return callback(new Error(`HTTP Error ${res.statusCode}: ${deserializedData}`));
            // }
            // console.log(deserializedData);
            // console.log(deserializedData);
            callback(deserializedData.error, deserializedData.value);
            return;
        });
    });

    req.on('error', (err) => {
        callback(new Error(`send fail${err}`));
    });
    req.write(serializedMsg);
    req.end();
}

module.exports = { send};
// module.exports = {send:distribution.local.comm.send}