const distribution = require('./config.js');
const comm = distribution.local.comm;


let totalTime = 0;
let count = 1000;
const node = distribution.node.config;
const remote = {node: node, service: 'status', method: 'get'};
const message = ['nid']; // Arguments to the method
let startTime = performance.now();
// throughput Comm Send
for (let i = 0; i < 1000; i++){
    comm.send(message,remote, (e,v)=>{
        if (e!=null){
            console.log(e);
        }
        count--;
        if (count == 0){
            let endTime = performance.now();
            totalTime = endTime-startTime;
            console.log('COMM.SEND throughput');
            console.log(`Total Time is ${totalTime} millisecond`);
            console.log(`throughput of comm.send is ${1000/totalTime} task per millisecond`);
        }
    })
}

// latency helper function
function comm_send_latency_helper(tries, cb){
    tries--;
    if (tries == 0){
        cb();
        return;
    }
    comm.send(message,remote, (e,v)=>{
        comm_send_latency_helper(tries, cb);
    })
}
startTime = performance.now();
totalTime = 0;
comm_send_latency_helper(1000,(e,v)=>{
    let endTime = performance.now();
    totalTime = endTime-startTime;
    console.log('COMM.SEND latency');
    console.log(`Total Time is ${totalTime} millisecond`);
    console.log(`latency of comm.send is ${totalTime/1000} millisecond per task`);
})
