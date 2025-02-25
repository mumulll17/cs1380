/* Notes/Tips:

- Use absolute paths to make sure they are agnostic to where your code is running from!
  Use the `path` module for that.
*/
const path = require('path');
const id = require("../util/id");
const fs = require('fs');
const serialization = require("../util/serialization");
// create the folder at the root folder
const dirPath = path.join(__dirname, '/store');
const SecondaryDirPath = path.join(__dirname, `/store/${global.moreStatus['nid']}`);
if (!fs.existsSync(dirPath)) {
  fs.mkdir(dirPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Directory created successfully!');
    fs.mkdir(SecondaryDirPath,(err)=>{
      if (err) {
        console.error(err);
        return;
      }
      console.log('Secondary Directory created successfully!');
    });
  });
} else {
  console.log('Directory already exists!');
  if (!fs.existsSync(SecondaryDirPath)){
    fs.mkdir(SecondaryDirPath,(err)=>{
      if (err) {
        console.log(err);
        return;
      }
      console.log('Secondary Directory created successfully!');
    });
  }
}

function put(state, configuration, callback) {
  if (typeof configuration === "string"){
    let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
    fs.writeFile(`${SecondaryDirPath}/${pathName}`,serialization.serialize(state),(e)=>{
      if (e){
        callback(new Error('error is',{source:e}));
        return;
      }
      callback(null,state);
      return;
    })
  }else if(configuration == null){
    const pathName = id.getID(state);
    fs.writeFile(`${SecondaryDirPath}/${pathName}`,serialization.serialize(state),(e)=>{
      if (e){
        callback(new Error('error is',{source:e}));
        return;
      }
      callback(null,state);
      return;
    })
  }else{
    callback(new Error("Configuration name is not a string or null"));
    return;
  }

}

function get(configuration, callback) {
  if (typeof configuration === "string"){
    let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
    fs.readFile(`${SecondaryDirPath}/${pathName}`,'utf8',(e,v)=>{
      if (e){
        callback(new Error('error is',{source:e}));
        return;
      }
      const state = serialization.deserialize(v)
      callback(null,state);
      return;
    })
  }else if (configuration == null){
    fs.readdir(SecondaryDirPath,(e,v)=>{
      if (e){
        callback(new Error('error is',{source:e}));
        return;
      }
      callback(null,v);
      return;
    })
  }else{
    callback(new Error("Configuration name is not a string or null"));
    return;
  }
}

function del(configuration, callback) {
  let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
  if (typeof configuration === "string"){
    fs.readFile(`${SecondaryDirPath}/${pathName}`,'utf8',(e,v)=>{
      if (e){
        callback(new Error('error is',{source:e}));
        return;
      }
      const state = serialization.deserialize(v)
      fs.unlink(`${SecondaryDirPath}/${pathName}`,(e)=>{
        if (e){
          callback(new Error('error is',{source:e}));
          return;
        }
        callback(null,state)
        return;
      })
    })
  }else{
    callback(new Error("Configuration name is not a string or null"));
    return;
  }
}

module.exports = {put, get, del};
