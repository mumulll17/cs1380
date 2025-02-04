const { assert } = require('console');
const distribution = require('../../config.js');
const builtinLibs = require('repl')._builtinLibs
const util = distribution.util;
const fs = require('fs');

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
const object = function f() {
    return "Hello World";
  };
const serialized = distribution.util.serialize(object);
const deserialized = distribution.util.deserialize(serialized);

console.log(serialized)
console.log(deserialized)
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