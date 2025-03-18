const distribution = require('../../config.js');
const Id = require('../util/id');
const comm = require('./comm.js');
/** @typedef {import("../types").Callback} Callback */

/**
 * Map functions used for mapreduce
 * @callback Mapper
 * @param {any} key
 * @param {any} value
 * @returns {object[]}
 */

/**
 * Reduce functions used for mapreduce
 * @callback Reducer
 * @param {any} key
 * @param {Array} value
 * @returns {object}
 */

/**
 * @typedef {Object} MRConfig
 * @property {Mapper} map
 * @property {Reducer} reduce
 * @property {string[]} keys
 */


/*
  Note: The only method explicitly exposed in the `mr` service is `exec`.
  Other methods, such as `map`, `shuffle`, and `reduce`, should be dynamically
  installed on the remote nodes and not necessarily exposed to the user.
*/

function mr(config) {
  const context = {
    gid: config.gid || 'all',
  };

  /**
   * @param {MRConfig} configuration
   * @param {Callback} cb
   * @return {void}
   */
  function exec(configuration, cb) {
    // first create a random id
    const randomID = Id.getID(configuration);

    // create a map function
    // keys are keys for this node
    // gid is the context gid
    // map is configuration.map
    const mapper = function(keys, gid, map, mrID, callback){
      const counts = 0;
      const outs = [];
      for (let key of keys){
        distribution[gid].store.get(key,(e,v)=>{
          const out = map(key,v);
          if (Array.isArray(out)){
            outs.push(...out);
          } else {
            outs.push(out);
          }
          counts++;
          if (counts == keys.length){
            distribution.local.store.put(outs,`${mrID}_mapped`,(e,v)=>{
              callback(null,outs);
            })
          }
        })      
      }
    }
    // create a shuffle function
    // mrID is the random id
    const shuffler = function(mrID, callback, gid){
      const counts = 0;
      distribution.local.store.get(`${mrID}_mapped`, (e,v)=>{
        // v should be an array of key-value pairs gotten from map
        for (let ele of v){
          let key = Object.keys(ele)[0];
          distribution[gid].mem.append(ele[key], key, (e,v)=>{
            if (e){
              console.log(e);
            }
            counts++;
            if (counts == v.length){
              callback(null,counts);
            }
          })
        }
      })
    }
    // create a reduce function
    const reducer = function(reduce, gid, callback){
      let outs = [];
      let count = 0;
      distribution.local.mem.get({gid:gid,key:null},(e,v)=>{
        let target = v.length;
        // v should be a list of keys
        for (let k of v){
          distribution.local.mem.get({gid:gid,key:k},(e,v)=>{
            // v here should be a list of values
            let out = reduce(k,v);
            outs.push(out);
            count++;
            if (count == target){
              callback(null,outs);
            }
          })
        }
      })
    }
    // create a service map
    const service = {
      map: mapper,
      shuffle:shuffler,
      reduce:reducer
    }
    // put on nodes's routes
    global.distribution[gid].routes.put(service,randomID, (e,v)=>{
      // mapper phase
      global.distribution[gid].groups.get('all', (e,v)=>{
        console.log(v);
      })
    })
  }
  return {exec};
};

module.exports = mr;
