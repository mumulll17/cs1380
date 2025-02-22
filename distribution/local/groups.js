// const { group, string } = require("yargs");
const id = require("../util/id");
// const comm = require("@brown-ds/distribution/distribution/all/comm");
const all = require("../all/all.js");
// const distribution = require('../../config.js');
// const all = require("../all");
const groups = {groups:{}};
const log = require('../util/log');

groups.get = function(name, callback) {
    if (name == 'all'){
        callback(null,groups.groups);
        return;
    }
    if (groups.groups.hasOwnProperty(name)){
        callback(null,groups.groups[name]);
        return;
    }
    callback(Error(`No ${name} in these groups`));
    return;
};

groups.put = function(config, group, callback) {
    if (typeof config == "string" ){
        config = {gid:config};
    }
    // console.log(config);
    groups.groups[config.gid] = group;
    global.distribution[config.gid] = {  
        comm: all.comm(config),
        groups: all.groups(config),
        status: all.status(config),
        routes: all.routes(config),
        gossip: all.gossip(config),
        mem: all.mem(config),
        store: all.store(config),
        mr: all.mr(config),
    };
    // console.log(group);
    // console.log(global.distribution);
    callback(null,group);
    return;
};

groups.del = function(name, callback) {
    if (groups.groups.hasOwnProperty(name)){
        let group = groups.groups[name];
        delete groups.groups[name];
        callback(null,group);
        return;
    }
    callback(Error(`No ${name} in these groups`));
    return
};

groups.add = function(name, node, callback) {
    if (groups.groups.hasOwnProperty(name)){
        groups.groups[name][id.getSID(node)] = node;
        if (callback){
            callback(null,groups.groups[name]);
        }
        return;
    }
    log(JSON.stringify(groups.groups),'bug');
    callback(Error(`No ${name} in these groups`));
    return;
};

groups.rem = function(name, node, callback) {
    if (groups.groups.hasOwnProperty(name)){
        if (groups.groups[name].hasOwnProperty(node)){
            delete groups.groups[name][node];
            if (callback){
                callback(null,groups.groups[name]);
            }
            return;
        }
        callback(Error(`No ${node} in group ${name}`));
        return;
    }
    callback(Error(`No ${name} in these groups`));
    return;
};

module.exports = groups;
