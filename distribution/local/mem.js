global.memMap = {all:{}};
// const crypto = require("crypto");
// const serialization = require("../util/serialization");
const id = require("../util/id");
const { globalAgent } = require("http");
const log = require("../util/log");
const { glob, openAsBlob } = require("fs");
function put(state, configuration, callback) {
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
                log(gid,"bug");
            }else{
                global.memMap['all'][key] = state;
            }
            console.log()
            log(JSON.stringify(global.memMap));
            callback(null,state);
            return
        }
        callback(new Error("Wrong object in local mem put"));
        return;
    }
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
};

function get(configuration, callback) {
    if (typeof configuration === "string" || configuration == null){
        configuration = {key:configuration};
    }
    log(JSON.stringify(configuration),"buginget");
    if (configuration instanceof Object){
        if (configuration.hasOwnProperty("key")){
            let key = configuration.key;
            let gid = 'all';
            if (configuration.hasOwnProperty("gid")){ //get the gid if it has one
                gid = configuration.gid;
                if (!global.memMap.hasOwnProperty(gid)){
                    // callback(new Error(`No such gid ${gid} in the map`));
                    callback(null,{})//instead return an error, want to return an empty list
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
};

module.exports = {put, get, del};
