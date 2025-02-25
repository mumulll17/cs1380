global.memMap = {all:{}};
// const crypto = require("crypto");
// const serialization = require("../util/serialization");
const id = require("../util/id");
const { globalAgent } = require("http");
const { glob, openAsBlob } = require("fs");
function put(state, configuration, callback) {
    console.log(configuration)
    if (typeof configuration === "string" || configuration == null){
        configuration = {key:configuration};
    }
    if (configuration instanceof Object){
        if (configuration.hasOwnProperty("key")){
            let key = configuration.key;
            if (key == null){ //if key is null
                key = id.getID(state);
            }
            if (configuration.hasOwnProperty("gid") && configuration.gid!='all'){ //get the gid if it has one
                let gid = configuration.gid;
                if (!global.memMap.hasOwnProperty(gid)){
                    global.memMap[gid] = {};
                }
                global.memMap[gid][key] = state;
            }
            global.memMap['all'][key] = state;
            callback(null,state);
            return
        }
        callback(new Error("Wrong object in local mem put"));
        return;
    }
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
    // // if it is a string
    // if (typeof configuration === "string"){
    //     global.memMap[configuration] = state;
    //     callback(null,state);
    //     return;
    // }
    // else if (configuration == null){
    //     global.memMap[id.getID(state)] = state;
    //     callback(null,state);
    //     return;
    // }
    // }
    // callback(new Error("Configuration name is not a string or null"));
    // return;
};

function get(configuration, callback) {
    if (typeof configuration === "string" || configuration == null){
        configuration = {key:configuration};
    }
    if (configuration instanceof Object){
        if (configuration.hasOwnProperty("key")){
            let key = configuration.key;
            let gid = 'all';
            if (configuration.hasOwnProperty("gid")){ //get the gid if it has one
                gid = configuration.gid;
                if (!global.memMap.hasOwnProperty(gid)){
                    callback(new Error(`No such gid ${gid} in the map`));
                    return
                }
            }
            if (key == null){ //if key is null
                callback(null,Object.keys(global.memMap[gid]));
                return;
            }
            if (!global.memMap[gid].hasOwnProperty(key)){
                callback(new Error(`No such key ${key} in the map`));
                return;
            }
            callback(null,global.memMap[gid][key]);
            return;
        }
        callback(new Error("Wrong object in local mem get"));
        return;
    }
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
    // if (typeof configuration === "string"){
    //     if (global.memMap.hasOwnProperty(configuration)){
    //         callback(null,global.memMap[configuration]);
    //         return;
    //     }
    //     callback(new Error(`No such key ${configuration} in the map`));
    //     return;
    // }
    // else if (configuration == null){ //if it is null, return all the keys
    //     callback(null,Object.keys(global.memMap));
    //     return;
    // }
    // callback(new Error("configuration is not a string or null"));
    // return;

}

function del(configuration, callback) {
    if (typeof configuration === "string"){
        configuration = {key:configuration};
    }
    if (configuration instanceof Object){
        if (configuration.hasOwnProperty("key")){
            let key = configuration.key;
            let gid = 'all';
            if (configuration.hasOwnProperty("gid")){ //get the gid if it has one
                gid = configuration.gid;
                if (!global.memMap.hasOwnProperty(gid)){
                    callback(new Error(`No such gid ${gid} in the map`));
                    return
                }
            }
            if (!global.memMap[gid].hasOwnProperty(key)){
                callback(new Error(`No such key ${key} in the map`));
                return;
            }
            let obj = global.memMap[gid][key];
            delete global.memMap[gid][key];
            callback(null,obj);
            return;
        }
        callback(new Error("Wrong object in local mem del"));
        return;
    }
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
    // if (typeof configuration === "string"){
    //     if (global.memMap.hasOwnProperty(configuration)){
    //         let obj = global.memMap[configuration];
    //         delete global.memMap[configuration];
    //         callback(null,obj);
    //         return;
    //     }
    //     callback(new Error(`No such key ${configuration} in the map`));
    //     return;
    // }
    // callback(new Error("configuration is not a string or null"));
    // return;
};

module.exports = {put, get, del};
