/*
    Checklist:

    1. Serialize strings v
    2. Serialize numbers v
    3. Serialize booleans v
    4. Serialize (non-circular) Objects v
    5. Serialize (non-circular) Arrays v
    6. Serialize undefined and null v
    7. Serialize Date, Error objects v
    8. Serialize (non-native) functions v
    9. Serialize circular objects and arrays v
    10. Serialize native functions v
*/
const builtinLibs = require('repl')._builtinLibs
const avoidArr = ['crypto', 'punycode', 'sys', 'wasi']
const builtInObjects = builtinLibs.reduce((acc, lib) => {
  if (!avoidArr.includes(lib)){
      const obj = require(lib);
      acc[lib] = obj;
  }
  return acc;
}, {});  

const map = new Map();
let uniqueId = 0;
function serialize(object) {
  const type = typeof object;
  if (type == "number" || type == "string" || type == "boolean"){
    const serialized = {
      type : type,
      value : object.toString()
    }
    return JSON.stringify(serialized);
  } 
  else if (type == "undefined"){
    const serialized = {
      type : type,
      value : "undefined",
    }
    return JSON.stringify(serialized);
  }
  else if (object == null){
    const serialized = {
      type : "null",
      value : "null",
    }
    return JSON.stringify(serialized);
  }
  else if (type == 'function'){
    for (let key in builtInObjects){ //if it is native

        if (Object.values(builtInObjects[key]).includes(object)){
          const serialized = {
            type : "native",
            value : `${key}.${object.name}` 
          }
          return JSON.stringify(serialized);
        }
    }
      const serialized = {
        type : "function",
        value : object.toString()
      }
      return JSON.stringify(serialized);

  }
  // if it is an array
  else if (Array.isArray(object)){
    let serializedArr = {};
    for (let i = 0; i<object.length; i++){
      serializedArr[`${i}`] = serialize(object[i]);
    }
    return JSON.stringify({
      type: "array",
      value: serializedArr,
    })
  }
  else if (object instanceof Error){
    const serialized = {
      type : "error",
      value : object.message,
    }
    return JSON.stringify(serialized);
  }
  else if (object instanceof Date){
    const serialized = {
      type : 'date',
      value : object.toISOString()
    }
    return JSON.stringify(serialized)
  }
  else if (type === "object") {
    if (map.has(object)){
      return JSON.stringify({
        type : "object",
        value : "",
        id : map.get(object),
      })
    }
    let curId = uniqueId;
    map.set(object, curId);
    uniqueId++;
    let serializedObject = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        // Serialize the value and make sure it's turned into a string
        serializedObject[key] = serialize(object[key]);
      }
    }
    return JSON.stringify({
      type: "object",
      value: serializedObject, // Stringify the whole serialized object,
      id: curId,
    });
  }
}


function deserialize(string) {
  const parsedString = JSON.parse(string)
  if (parsedString.type == "number"){
    return Number(parsedString.value);
  }
  if (parsedString.type == "string"){
    return parsedString.value;
  }
  if (parsedString.type == "boolean"){
    if (parsedString.value == "false"){
      return false;
    } else{
      return true;
    }
  }
  if (parsedString.type == "null"){
    return null;
  }
  if (parsedString.type == "undefined"){
    return undefined;
  }
  if (parsedString.type == "function"){
    let functionStr = parsedString.value; 
    let g = new Function("return "+functionStr) ();
    return g;
  }
  if (parsedString.type == "object"){
    let curId = parsedString.id
    if (map.has(curId)){
      return map.get(curId);
    }
    map.set(curId,parsedString.value)
    let oriObject = parsedString.value;
    for (const key in oriObject){
      if (oriObject.hasOwnProperty(key)) {
        oriObject[key] = deserialize(oriObject[key])
      }
    }
    return oriObject;
  }
  if (parsedString.type == "array"){
    let arrObject = parsedString.value;
    let arr = []
    for (const key in arrObject){
      if (arrObject.hasOwnProperty(key)) {
        arr.push(deserialize(arrObject[key]))
      }
    }
    return arr
  }
  if (parsedString.type == "error"){
    let errorObject = new Error(parsedString.value);
    return errorObject;
  }
  if (parsedString.type == "date"){
    let dateObject = new Date(parsedString.value);
    return dateObject;
  }
  if (parsedString.type == "native"){
    let words = parsedString.value.split('.');
    let root = words[0];
    let child = words[1]
    return builtInObjects[root][child]
  }
}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
