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

const { parse, parsed } = require("yargs");


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
    let serializedObject = {};
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        // Serialize the value and make sure it's turned into a string
        serializedObject[key] = serialize(object[key]);
      }
    }
    return JSON.stringify({
      type: "object",
      value: serializedObject // Stringify the whole serialized object
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

}

module.exports = {
  serialize: serialize,
  deserialize: deserialize,
};
