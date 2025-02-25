const comm = require("../local/comm");
const id = require("../util/id");
function getNodes(context){
  //my function to get the nodes from the group
  const nodes = {};
  if (context.gid == 'all'){
    // console.log(global.distribution.local);
    for (let v of Object.values(global.distribution.local.groups.groups)){
      for (let k of Object.keys(v)){
        nodes[k] = v[k];
      }
    }
  } else {
      for (let k of Object.keys(global.distribution.local.groups.groups[context.gid])){
        nodes[k] = global.distribution.local.groups.groups[context.gid][k];
      }
  }
  return nodes
}
function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;

  /* For the distributed mem service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      // if (configuration == null){
      //   global.distribution[context.gid].comm.send([configuration],{service:"mem",method:"get"},(e,v)=>{
      //     if (v!={}){
      //       v = {value:Object.values(v).flat()};
      //     }
      //     callback(e,v);
      //     return;
      //   });
      // }
      const n = parseInt(configuration, 16);
      let hashedConfig = configuration;
      if (isNaN(n)){ //if it is not a kid
        hashedConfig = id.getID(configuration)
      }
      const nodes = getNodes(context);
      let nids = {}; //map match nid to node
      for (let node of Object.values(nodes)){
        nids[id.getNID(node)] = node;
      }
      let nid = context.hash(hashedConfig,Object.keys(nids));
      let node = nids[nid];
      const remote = {node: node, service: 'mem', method: 'get'};
      comm.send([{key:configuration,gid:context.gid}],remote,callback);
    },

    put: (state, configuration, callback) => {
      console.log(context.gid);
      let hashedConfig = id.getID(configuration);
      if (configuration == null){
        configuration = id.getID(state);
        hashedConfig = configuration
      }
      const nodes = getNodes(context);
      let nids = {}; //map match nid to node
      for (let node of Object.values(nodes)){
        nids[id.getNID(node)] = node;
      }
      let nid = context.hash(hashedConfig,Object.keys(nids));
      let node = nids[nid];
      const remote = {node: node, service: 'mem', method: 'put'};
      comm.send([state,{key:configuration,gid:context.gid}],remote,callback);
    },

    del: (configuration, callback) => {
      const n = parseInt(configuration, 16);
      let hashedConfig = configuration;
      if (isNaN(n)){ //if it is not a kid
        hashedConfig = id.getID(configuration)
      }
      const nodes = getNodes(context);
      let nids = {}; //map match nid to node
      for (let node of Object.values(nodes)){
        nids[id.getNID(node)] = node;
      }
      let nid = context.hash(hashedConfig,Object.keys(nids));
      let node = nids[nid];
      const remote = {node: node, service: 'mem', method: 'del'};
      comm.send([{key:configuration,gid:context.gid}],remote,callback);
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = mem;
