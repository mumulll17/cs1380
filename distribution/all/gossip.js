function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
const gossip = function(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.subset = config.subset || function(lst) {
    return Math.ceil(Math.log(lst.length));
  };

  return {
    send: (payload, remote, callback) => {
      const values = {};
      const errors = {};
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
      let count = Object.keys(nodes).length;
      if (typeof context.subset == 'number'){
        count = Math.min(context.subset,count);
      } else if(typeof context.subset == 'function'){
        count = context.subset(Object.keys(nodes));
      }
      const uniqueNumbers = new Set();
      while (uniqueNumbers.size < count) {
        const randomNumber = getRandomInt(count)
        uniqueNumbers.add(randomNumber);
      }
      const keys = Object.keys(nodes);
      for (let ind of uniqueNumbers){
        let key = keys[ind];
        const node = nodes[key];
        const message = [payload,remote,context.gid];
        const remote2 = {node:node,service:'gossip',method:'receive'};
        global.distribution.local.comm.send(message,remote2,(e,v)=>{
          count--;
          if (e!=null){
            errors[key] = e;
          }
          if (v!=null){
            values[key] = v;
          }
          if (count == 0){
            // console.log(errors)
            callback(errors,values);
            return
          }
        })
      }

    },

    at: (period, func, callback) => {
    },

    del: (intervalID, callback) => {
    },
  };
};

module.exports = gossip;
