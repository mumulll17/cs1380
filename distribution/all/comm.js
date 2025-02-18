/** @typedef {import("../types").Callback} Callback */
const distribution = require('../../config.js');
/**
 * NOTE: This Target is slightly different from local.all.Target
 * @typdef {Object} Target
 * @property {string} service
 * @property {string} method
 */

/**
 * @param {object} config
 * @return {object}
 */
function comm(config) {
  const context = {};
  context.gid = config.gid || 'all';

  /**
   * @param {Array} message
   * @param {object} configuration
   * @param {Callback} callback
   */
  function send(message, configuration, callback) {
    const values = {};
    const errors = {};
    const nodes = {};
    if (context.gid == 'all'){
      for (let v of Object.values(distribution.local.groups.groups)){
        for (let k of Object.keys(v)){
          nodes[k] = v[k];
        }
      }
    } else {
        for (let k of Object.keys(distribution.local.groups.groups[context.gid])){
          nodes[k] = distribution.local.groups.groups[context.gid][k];
        }
    }
    let count = Object.keys(nodes).length;
    for (let key of Object.keys(nodes)){
      let remote = {node:nodes[key],service:configuration.service,method:configuration.method};
      distribution.local.comm.send(message,remote,(e,v)=>{
        count--;
        if (e!=null){
          errors[key] = e;
        } else {
          values[key] = v;
        }
        if (count == 0){
          callback(errors,values);
          return
        }
      })
    }
    

  }

  return {send};
};

module.exports = comm;
