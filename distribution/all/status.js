// const distribution = require('../../config.js');
const status = function(config) {
  const context = {};
  context.gid = config.gid || 'all';
  return {
    get: (configuration, callback) => {
      global.distribution[context.gid].comm.send([configuration],{service:'status',method:'get'},(e,v)=>{
        for (let val of Object.values(v)){
          if (configuration == 'counts'){
            global.moreStatus.counts += val;
          } 
          if (configuration == 'heapTotal'){
            process.memoryUsage().heapTotal += val;
          }
          if (configuration == 'heapUsed'){
            process.memoryUsage().heapUsed += val;
          }
        }
        callback(e,v);
      });
    },
    spawn: (configuration, callback) => {
      global.distribution.local.status.spawn(configuration, (e,v)=>{
          global.distribution[context.gid].groups.add(context.gid,configuration,(e,v)=>{
            global.distribution.local.groups.add(context.gid,configuration,(e,v)=>{
            console.log(v);
            if (e) {
              callback(e,v);
              return;
            }
            callback(null,configuration);
          });
        })
      });
    },

    stop: (callback) => {
      global.distribution[context.gid].comm.send([],{service:'status',method:'stop'},(e,v)=>{
        callback(e,v);
        // global.distribution.local.status.stop(callback);
      })
    },
  };
};
// status.spawn = require('@brown-ds/distribution/distribution/all/status').spawn; 
// status.stop = require('@brown-ds/distribution/distribution/all/status').stop; 
module.exports = status;
