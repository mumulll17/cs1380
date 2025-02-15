const distribution = require('../../config.js');
const serialization = require('../util/serialization.js');
const local = distribution.local;
const id = distribution.util.id;
const routes = distribution.local.routes;
const node = distribution.node.config;
let localVar = 0;

const addOne = () => {
  return ++localVar;
};

const addOneRPC = distribution.util.wire.createRPC(
    distribution.util.wire.toAsync(addOne));

const addOneService = {
  addOneRemote: addOneRPC,
};

const remote = {node: node, service: 'routes', method: 'put'};
let m1 = [addOneService, 'oneService'];

local.comm.send(m1,remote,(e,v)=>{
    try {
        console.log(e);
        let a= Object.values(v)[0];
        console.log(1);
        console.log(a);
        a((e,v)=>{
          console.log("in the function");
          console.log(e);
          console.log(v);
        })
    }catch (error){
        console.log(error);
    }
})



local.comm.send([],{node:node,service:'oneService',method:'addOneRemote'},(e,v)=>{
  try {
    console.log(e);
    console.log(v);
    console.log(111);
}catch (error){
    console.log(error);
}
});
// let localVar = 0;

// const addOne = () => {
//   return ++localVar;
// };

// const addOneRPC = distribution.util.wire.createRPC(
//     distribution.util.wire.toAsync(addOne));

// const addOneService = {
//   addOneRemote: addOneRPC,
// };

// distribution.local.routes.put(addOneService, 'rpcService', (e, v) => {
//   // Call the RPC stub locally
//   addOneRPC((e, v) => {
//     try {
//       console.log(e);
//       console.log(v);
//       console.log(localVar);
//       // Simulate a remote call
//       distribution.local.comm.send([],
//           {node: distribution.node.config, service: 'rpcService', method: 'addOneRemote'}, (e, v) => {
//             try {
//               console.log(e);
//               console.log(v);
//               console.log(localVar);
//             } catch (error) {
//               console.log(error);
//               return;
//             }
//           });
//     } catch (error) {
//       console.log(error);
//       return;
//     }
//   });
// });