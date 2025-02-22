// const { assert } = require('console');
const distribution = require('../../config.js');
const builtinLibs = require('repl')._builtinLibs
const util = distribution.util;
const os = require('os');
const serialization = require('./serialization.js');

// const a = { ip: "127.0.0.1", port: 1234};
// const serialized = util.serialize(a);
// console.log(serialized);
// const x = { a: 1, b: 2, c: 3};
// x.self = x;
// const serialized = util.serialize(x);
// const deserialized = util.deserialize(serialized);
// console.log(serialized)
// console.log(deserialized)
// let a = fs.readFile
// const serialized = util.serialize(a);
// console.log(serialized)
// const deserialized = util.deserialize(serialized);
// console.log(deserialized)

// const f = function f() {};
// const original = [f, f];
// const serialized = util.serialize(original);
// const deserialized = util.deserialize(serialized);
// console.log(serialized)
// console.log(deserialized)

// const avoidArr = ['crypto', 'punycode', 'sys', 'wasi']
// const builtInObjects = builtinLibs.reduce((acc, lib) => {
//     if (!avoidArr.includes(lib)){
//         const obj = require(lib);
//         acc[lib] = obj;
//     }
//     return acc;
//   }, {});  
//   console.log(builtInObjects['assert'])
// for (let key in builtInObjects){ //if it is native
//       if (Object.values(builtInObjects[key]).includes(object)){
//         const serialized = {
//           type : "native",
//           value : `${key}.${object.name}` 
//         }
//         return JSON.stringify(serialized);
//       }
//   }

const config = { "ip": "127.0.0.1",
    "port": 8080,
    "onStart": (server) => console.log('hi!') };
let a = serialization.serialize(config);
let b = serialization.deserialize(a);
console.log(b.onStart());
console.log(a)