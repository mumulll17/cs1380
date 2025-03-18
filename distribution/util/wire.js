const log = require('../util/log');
const crypto = require("crypto");
const serialization = require('./serialization');
// let createRPC = require('@brown-ds/distribution/distribution/util/wire').createRPC;
// const distribution = require('../../config.js');
global.toLocal = {};
// global.toLocal['rpc'] = {};
// console.log(global.toLocal);
function createRPC(func) {
  if (!global.toLocal.hasOwnProperty('rpc')){
    global.toLocal['rpc'] = {};
  }
  // console.log(global.toLocal);
  const config = global.nodeConfig;
  // const config2 = global.nodeConfig2;
  // first, want to put func to the toLocal table
  const randomInput = Math.random().toString();
  const hash = crypto.createHash("sha256").update(randomInput).digest("hex");
  // console.log(global.toLocal);
  global.toLocal['rpc'][hash] = func;
  // console.log(func.toString());
  let g = (...args)=>{
    const comm = global.distribution.local.comm;
    const cb = args.pop();
    let remote = { node: '__NODE_INFO__', service: "rpc", method: '__hash__'};
    comm.send(args,remote,cb);
  }
  let serialized = serialization.serialize(g);
  let repalced = serialized.replace("'__NODE_INFO__'",JSON.stringify(config).replaceAll('"',"'")).replace("__hash__",hash);
  let deserialized = serialization.deserialize(repalced);
  return deserialized;
}
/*
  The toAsync function transforms a synchronous function that returns a value into an asynchronous one,
  which accepts a callback as its final argument and passes the value to the callback.
*/
function toAsync(func) {
  log(`Converting function to async: ${func.name}: ${func.toString().replace(/\n/g, '|')}`);

  // It's the caller's responsibility to provide a callback
  const asyncFunc = (...args) => {
    const callback = args.pop();
    try {
      const result = func(...args);
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  };

  /* Overwrite toString to return the original function's code.
   Otherwise, all functions passed through toAsync would have the same id. */
  asyncFunc.toString = () => func.toString();
  return asyncFunc;
}

// module.exports = require('@brown-ds/distribution/distribution/util/wire');

module.exports = {
  createRPC,
  toAsync,
};