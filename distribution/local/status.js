// const { isCryptoKey } = require('util/types');
const wire = require('../util/wire');
// const id = require('../util/id');
const serialization = require('../util/serialization');
const status = {};
const child_process = require('child_process');
const path = require('path');
// const log = require('../util/log.js');
// const { node } = require('@brown-ds/distribution');
// status.spawn = require('@brown-ds/distribution/distribution/local/status').spawn; 
// status.stop = require('@brown-ds/distribution/distribution/local/status').stop; 
global.moreStatus = {
  sid: global.distribution.util.id.getSID(global.nodeConfig),
  nid: global.distribution.util.id.getNID(global.nodeConfig),
  counts: 0,
};

status.get = function(configuration, callback) {
  callback = callback || function() { };
  // TODO: implement remaining local status items
  if (configuration === 'nid'){
    callback(null, global.moreStatus['nid']);
    return;
  }
  if (configuration === 'sid'){
    callback(null, global.moreStatus['sid']);
    return;
  }
  if (configuration === 'counts'){
    callback(null, global.moreStatus['counts']);
    return;
  }
  if (configuration === 'ip'){
    // log(global.nodeConfig.ip,'in status get');
    callback(null, global.nodeConfig.ip);
    return;
  }
  if (configuration === 'port'){
    callback(null, global.nodeConfig.port);
    return;
  }
  if (configuration === 'heapTotal') {
    callback(null, process.memoryUsage().heapTotal);
    return;
  }
  if (configuration === 'heapUsed') {
    callback(null, process.memoryUsage().heapUsed);
    return;
  }
  callback(new Error('Status key not found'));
};


status.spawn = function(configuration, callback) {
  // console.log(global.toLocal);
  // const asyncFunc = wire.toAsync(callback);
  // console.log(global.toLocal);
  const RPCStub = wire.createRPC(callback);
  // if there is onStart
  if (configuration.hasOwnProperty('onStart')){
    const onStart = new Function(`
      const func1 = ${configuration.onStart.toString()};
      func1();
      const func3 = ${RPCStub.toString()};
      func3();
    `);
    // console.log(onStart.toString());
    configuration['onStart'] = onStart;
  } else {
    configuration['onStart'] = RPCStub;
  }
  // console.log(RPCStub.toString());
  const serialized = serialization.serialize(configuration);
  // console.log(serialized);
  // console.log("before spawn");
  const newPath = path.join(__dirname,'../../distribution.js');
  // const child = child_process.spawn('node',[`${newPath}`, '--config', serialized],{detached:true,stdio:"inherit"});
  const child = child_process.spawn('node',[`${newPath}`, '--config', serialized]);
  child.on('error', (err)=>{
    console.error(`Error is ${err}`);
  })
};

status.stop = function(callback) {
  // log(global.distribution.node.config.ip,'instatusstop');
  callback(null,global.distribution.node.config);
  // setTimeout(() => {
    if (global.distribution.node.server){
      global.distribution.node.server.close();
    }
  // }, 5000);
  process.exit();

};

module.exports = status;
