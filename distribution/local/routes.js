/** @typedef {import("../types").Callback} Callback */
const status = require("./status");
// const routes = require("./routes");
const comm = require("./comm");
const wire = require("../util/wire");
// const log = ('../util/log');
// const { config } = require("yargs");
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
    // console.log(configuration);
    if (configuration instanceof Object){ //if it is an object
        if (configuration.hasOwnProperty('gid') && configuration.gid!='local'){
            const group = configuration.gid;
            if (global.distribution.hasOwnProperty(group)){
                if (global.distribution[group].hasOwnProperty(configuration.service)){
                    callback(null, global.distribution[group][configuration.service]);
                    return;
                }
                else{
                    const rpc = wire.toLocal[configuration.service];
                    if (rpc) {
                        callback(null, global.toLocal['rpc']);
                    } else {
                        callback(new Error(`Service ${configuration.service} not found!`));
                    }
                }
                return;
            }
            console.error('error here');
            callback(Error(`No group ${group}`));
            return;
            }else{
                configuration = configuration.service;
            }
    }
    if (services.hasOwnProperty(configuration)) {
        callback(null, services[configuration]);
        return;
    }
    else if (configuration == 'rpc'){
        callback(null, global.toLocal['rpc']);
        return;
    }
    callback(new Error(`Service ${configuration} not found`));
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
// module.exports = require('@brown-ds/distribution/distribution/local/routes');
services.routes = module.exports;