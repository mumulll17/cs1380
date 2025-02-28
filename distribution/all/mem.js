const { all, local } = require("@brown-ds/distribution");
const comm = require("../local/comm");
const id = require("../util/id");
const { get } = require("../local/status");
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
      if (configuration === null){
        global.distribution[context.gid].comm.send([{key:null,gid:context.gid}],{service:'mem',method:'get'},(e,v)=>{
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
      const remote = {node: node, service: 'mem', method: 'get'};
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
      global.distribution[context.gid].comm.send([{key:null,gid:context.gid}],{service:'mem',method:'get'},(e,v)=>{
        const res = {};
        const vals = Object.values(v).flat();
        let count = 0;
        for (let val of vals){
          if (typeof val=="string"){
            console.log(val)
            res[count] = val;
            count+=1
          }
        }
        if (e!={}){
          callback(e,res);
        }
        console.log(res);
        //get the new group
        global.distribution.local.groups.get(context.gid,(e,newGroup)=>{
          if (e!=null){
            callback(e);
          }
          const oldGroup = configuration;
          const oldNids = Object.values(oldGroup).map((node)=>id.getNID(node));
          console.log(oldNids);
          const newNids = Object.values(newGroup).map((node)=>id.getNID(node));
          console.log(newNids);
          const kids = Object.values(res).map((key)=>id.getID(key));
          console.log(kids);
          const diffGroup = []
          let ind = 0;
          for (let kid of kids){
            let oldNid = context.hash(kid,oldNids);
            let newNid = context.hash(kid,newNids);
            // console.log(oldNid);
            // console.log(newNid);
            if (oldNid!=newNid){
              diffGroup.push([oldNid,newNid,Object.values(res)[ind]]);
            }
            ind++;
          }
          console.log(diffGroup);
          let count = diffGroup.length;
          for (let nodes of diffGroup){
            let oldNode = oldGroup[nodes[0].substring(0, 5)];
            let newNode = newGroup[nodes[1].substring(0, 5)];
            // console.log(nodes[2]);
            global.distribution.local.comm.send([{key:nodes[2],gid:context.gid}],{node: oldNode, service: 'mem', method: 'get'},(e,v)=>{
              if (e){
                console.log(e);
                return;
              }
              global.distribution.local.comm.send([{key:nodes[2],gid:context.gid}],{node: oldNode, service: 'mem', method: 'del'},(e,v)=>{
                if (e){
                  console.log(e);
                  return;
                }
                console.log(v);
                console.log(newNode);
                global.distribution.local.comm.send([v,{key:nodes[2],gid:context.gid}],{node: newNode, service: 'mem', method: 'put'},(e,v)=>{
                  count--;
                  console.log(nodes[2]);
                  console.log(context.gid);
                  console.log(e);
                  if (count == 0){
                    callback(null,diffGroup);
                  }
                });
              });
            })
          }
        })
      })
    },
  };
};

module.exports = mem;
