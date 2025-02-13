/** @typedef {import("../types").Callback} Callback */
const status = require("./status");
// const routes = require("./routes");
const comm = require("./comm");

const services = {
    status,
    comm,
};

/**
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function get(configuration, callback) {
    
    if (services.hasOwnProperty(configuration)) {
        callback(null, services[configuration]);
        return;
    }
    callback(new Error('Service not found'));
}

/**
 * @param {object} service
 * @param {string} configuration
 * @param {Callback} callback
 * @return {void}
 */
function put(service, configuration, callback) {
    services[configuration] = service;
    if (typeof callback === "function") {
        callback(null, service);
    }
    return;
}

/**
 * @param {string} configuration
 * @param {Callback} callback
 */
function rem(configuration, callback) {
    if (services.hasOwnProperty(configuration)) {
        delete services[configuration];
        callback(null, true);
        return;
    }
    callback(new Error("Service not found"));
};

module.exports = {get, put, rem};
services.routes = module.exports;