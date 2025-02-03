const distribution = require('../../config.js');
const util = distribution.util;
const date = new Date();
const serialized = util.serialize(date);
const deserialized = util.deserialize(serialized);
console.log(serialized)
// console.log(deserialized)