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

function store(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || global.distribution.util.id.naiveHash;
  /* For the distributed store service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
      if (configuration == null){
        global.distribution[context.gid].comm.send([{key:null,gid:context.gid}],{service:'store',method:'get'},(e,v)=>{
          console.log(v);
          const res = {};
          const vals = Object.values(v).flat();
          let count = 0;
          for (let val of vals){
            res[count] = val;
            count+=1
          }
          console.log(res);
          callback(e,res);
        })
        return;
      }
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
      const remote = {node: node, service: 'store', method: 'get'};
      comm.send([{key:configuration,gid:context.gid}],remote,callback);
    },

    put: (state, configuration, callback) => {
      // console.log(context.gid);
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
      // console.log(nids);
      // console.log(hashedConfig);
      let nid = context.hash(hashedConfig,Object.keys(nids));
      // console.log(nid);
      let node = nids[nid];
      // console.log(node);
      const remote = {node: node, service: 'store', method: 'put'};
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
            const remote = {node: node, service: 'store', method: 'del'};
            comm.send([{key:configuration,gid:context.gid}],remote,callback);
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = store;
