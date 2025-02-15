const distribution = require('./config.js');



// RPC
let startTime = performance.now();
let totalTime = 0;
let count = 1000;

// const node = {ip: '127.0.0.1', port: 9014};
// distribution.node.start((server) => {
//     function cleanup(callback) {
//       server.close();
//       distribution.local.comm.send([],
//           {node: node, service: 'status', method: 'stop'},
//           callback);
//     }
//     // Spawn the remote node.
//     distribution.local.status.spawn(node, (e, v) => {
//         // throughput Comm Send
//         for (let i = 0; i < 1000; i++){
//             rpcFunc(node, ()=>{

//                 if (e!=null){
//                     console.log(e);
//                 }
//                 count--;
//                 if (count == 0){
//                     let endTime = performance.now();
//                     totalTime = endTime-startTime;
//                     console.log('COMM.SEND throughput');
//                     console.log(`Total Time is ${totalTime} millisecond`);
//                     console.log(`throughput of comm.send is ${1000/totalTime} task per millisecond`);
//                     cleanup(console.log());
//                     return;
//                 }
//             })
//         }
//     });
// });
function rpcFunc(node, cb){
    let n = 0;
    let addOne = () => {
    return ++n;
    };


    const rpcService = {
    addOne: distribution.util.wire.createRPC(distribution.util.wire.toAsync(addOne)),
};
    // Install the addOne service on the remote node with the name 'addOneService'.
    distribution.local.comm.send([rpcService, 'addOneService'],
        {node: node, service: 'routes', method: 'put'}, (e, v) => {
            distribution.local.comm.send([],
                {node: node, service: 'addOneService', method: 'addOne'}, (e, v) => {
                try {
                    // console.log(e);
                    // console.log(v);
                    cb();
                } catch (error) {
                    console.log(error);
                }
                });
    });

}
const node = {ip: '127.0.0.1', port: 9014};
// latency helper function
function comm_send_latency_helper(tries,node, cb){
    tries--;
    if (tries == 0){
        cb();
        return;
    }
    rpcFunc(node, ()=>{
        comm_send_latency_helper(tries,node, cb);
    })
}
startTime = performance.now();
totalTime = 0;
distribution.node.start((server) => {
    function cleanup(callback) {
    server.close();
    distribution.local.comm.send([],
        {node: node, service: 'status', method: 'stop'},
        callback);
    }
    // Spawn the remote node.
    distribution.local.status.spawn(node, (e, v) => {
    comm_send_latency_helper(1000,node,(e,v)=>{
        cleanup(console.log());
        let endTime = performance.now();
        totalTime = endTime-startTime;
        console.log('COMM.SEND latency');
        console.log(`Total Time is ${totalTime} millisecond`);
        console.log(`latency of comm.send is ${totalTime/1000} millisecond per task`);
        return;
    })
    });
});