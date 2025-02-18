/** @typedef {import("../types").Callback} Callback */
const status = require("./status");
// const routes = require("./routes");
const comm = require("./comm");
const wire = require("../util/wire");
const { config } = require("yargs");
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
    if (configuration instanceof Object){ //if it is an object
        const group = configuration.gid;
        if (global.distribution.hasOwnProperty(group)){
            if (global.distribution[group].hasOwnProperty(configuration.service)){
                callback(null, global.distribution[group][configuration.service]);
                return;
            }
            else{
                const rpc = global.toLocal[configuration.service];
                if (rpc) {
                     callback(null, { call: rpc });
                 } else {
                     callback(new Error(`Service ${configuration.service} not found!`));
                  }
              }
            return;
        }
        callback(Error(`No group ${group}`));
        return;
    }
    if (services.hasOwnProperty(configuration)) {
        callback(null, services[configuration]);
        return;
    }
    else{
        const rpc = global.toLocal[configuration];
        if (rpc) {
             callback(null, { call: rpc });
         } else {
             callback(new Error(`Service ${configuration} not found!`));
          }
      }
    //  else if (wire.toLocal.hasOwnProperty(configuration)){ // if it is rpc
    //     callback(null, wire.toLocal[configuration]);
    //     return;
    // }
    // callback(new Error(`Service ${configuration} not found`));
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
        let a = services[configuration];
        delete services[configuration];
        callback(null, a);
        return;
    }
    callback(null,null);
};

module.exports = {get, put, rem};
services.routes = module.exports;