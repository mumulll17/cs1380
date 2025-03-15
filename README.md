# distribution

This is the distribution library. When loaded, distribution introduces functionality supporting the distributed execution of programs. To download it:

## Installation

```sh
$ npm i '@brown-ds/distribution'
```

This command downloads and installs the distribution library.

## Testing

There are several categories of tests:
  *	Regular Tests (`*.test.js`)
  *	Scenario Tests (`*.scenario.js`)
  *	Extra Credit Tests (`*.extra.test.js`)
  * Student Tests (`*.student.test.js`) - inside `test/test-student`

### Running Tests

By default, all regular tests are run. Use the options below to run different sets of tests:

1. Run all regular tests (default): `$ npm test` or `$ npm test -- -t`
2. Run scenario tests: `$ npm test -- -c` 
3. Run extra credit tests: `$ npm test -- -ec`
4. Run the `non-distribution` tests: `$ npm test -- -nd`
5. Combine options: `$ npm test -- -c -ec -nd -t`

## Usage

To import the library, be it in a JavaScript file or on the interactive console, run:

```js
let distribution = require("@brown-ds/distribution");
```

Now you have access to the full distribution library. You can start off by serializing some values. 

```js
let s = distribution.util.serialize(1); // '{"type":"number","value":"1"}'
let n = distribution.util.deserialize(s); // 1
```

You can inspect information about the current node (for example its `sid`) by running:

```js
distribution.local.status.get('sid', console.log); // 8cf1b
```

You can also store and retrieve values from the local memory:

```js
distribution.local.mem.put({name: 'nikos'}, 'key', console.log); // {name: 'nikos'}
distribution.local.mem.get('key', console.log); // {name: 'nikos'}
```

You can also spawn a new node:

```js
let node = { ip: '127.0.0.1', port: 8080 };
distribution.local.status.spawn(node, console.log);
```

Using the `distribution.all` set of services will allow you to act 
on the full set of nodes created as if they were a single one.

```js
distribution.all.status.get('sid', console.log); // { '8cf1b': '8cf1b', '8cf1c': '8cf1c' }
```

You can also send messages to other nodes:

```js
distribution.all.comm.send(['sid'], {node: node, service: 'status', method: 'get'}, console.log); // 8cf1c
```

# Results and Reflections

> ...

# M1: Serialization / Deserialization


## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M1 (`hours`) and the lines of code per task.


My implementation comprises `one` software components, totaling `about 250` lines of code. Key challenges included `1. serialization and deserialization of objects, I solved it by including recursion in them. The second challenge is the first extra credit, which requires us to support cycles in object, and I solved it with adding a new field called id and a map. I used the map to find the cycle and the id to find which refer to which when deserializing`.

I have done all extra credits. They are all included in the distribution/util/serialization.js file. 


## Correctness & Performance Characterization


> Describe how you characterized the correctness and performance of your implementation


*Correctness*: I wrote `11` tests; these tests take `6.365 seconds` to execute. This includes objects with `test of int, string, boolean, null, undefined, function, object/array, error, date, native functions, cycle object`.


*Performance*: The latency of various subsystems is described in the `"latency"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.

Note: the latency is second per object for the whole process.


# M2: Actors and Remote Procedure Calls (RPC)


## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M2 (`hours`) and the lines of code per task.


My implementation comprises `4` software components, totaling `400` lines of code. Key challenges included `The hardest part of this project is comm send and the node.js. I solved it by sending a http put request to the remote node with all options and serialized message. When it got to the remote node, I would process the path to get service and method, and finally read the message to get what arguments it will be. The next hardest part is rpc, I have met many bugs in this extra credit, and I finally fixed them by moving the replacement code that replace node_info to real node information to the createRPC from comm.send`.


## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation


*Correctness*: I wrote `<5>` tests; these tests take `<6.754 seconds>` to execute.


*Performance*: I characterized the performance of comm and RPC by sending 1000 service requests in a tight loop. Average throughput and latency is recorded in `package.json`.
They are in the entry called latency_comm_send and throughput_comm_send. Their unit is based on millisecond.

## Key Feature

> How would you explain the implementation of `createRPC` to someone who has no background in computer science — i.e., with the minimum jargon possible?

The createRPC is the code that takes a function in and gives you a function that allow somebody else from a remote computer to run your function on your computer. And it also allows you to send the result back to the other user.


# M3: Node Groups & Gossip Protocols


## Summary

> Summarize your implementation, including key challenges you encountered. Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M3 (`hours`) and the lines of code per task.


My implementation comprises `<10>` new software components, totaling `<400>` added lines of code over the previous implementation. Key challenges included `Local spawn and stop and all comm send. For comm send, the challenge is that I need to get the nodes and record all error and values, and it needs to be very detailed. For local spawn and stop, they are all related to other nodes, and it is hard to debug them. I tried to use log and help from TA to find out which part is wrong`.

I have tried implementing the gossip send. I think I am on the right track, but I can't finish it.

## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation


*Correctness* -- number of tests and time they take.
I passed all required test. There are about 7 tests. They took me about 2 minutes to finish all of them.

*Performance* -- spawn times (all students) and gossip (lab/ec-only).
It took about three seconds to spawn five nodes, and they are tested in my student test for m3.

## Key Feature

> What is the point of having a gossip protocol? Why doesn't a node just send the message to _all_ other nodes in its group?

It makes the scale smaller, so it can be more affordable. Similarly, it is more efficient

# M4: Distributed Storage


## Summary

> Summarize your implementation, including key challenges you encountered

I have done all required parts and two extra credit, ec1 and ec2. This project is about how to store things in the distributed system. Key challenges are many bugs in the way of implementing the second extra credit and many coding decision I have to make during the process. 

Remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete each task of M4 (`hours`) and the lines of code per task.


## Correctness & Performance Characterization

> Describe how you characterized the correctness and performance of your implementation


*Correctness* -- number of tests and time they take.
I implemented 5 student test and they took 12.621 second. For all other tests I passed, they took about 2 minutes.

*Performance* -- insertion and retrieval.

Insertion of 1000 nodes to three AWS remote nodes takes about 7367 millisecond, and throuput:0.135734828722023, latency:7.367305866999999
retrieval of 1000 nodes to three AWS remote nodes takes about 7301 millisecond, and throuput:0.1369512220272375, latency:7.301869857000001


## Key Feature

> Why is the `reconf` method designed to first identify all the keys to be relocated and then relocate individual objects instead of fetching all the objects immediately and then pushing them to their corresponding locations?

I guess the reason is that the group and nodes inside have changed, and it will be problemetic to just fetch all current objects without considering what could be affected by the changes.