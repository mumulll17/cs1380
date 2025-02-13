const distribution = require('../../config.js');
const local = distribution.local;
const id = distribution.util.id;


const node = distribution.node.config;
console.log(node);
const remote = {node: node, service: 'status', method: 'get'};
const message = ['invalid'];
local.comm.send(message, remote, (e, v) => {
    try {
        console.log(e);
        console.log(v);
    } catch (error) {
        console.log(e);
    }
  });