/* Notes/Tips:

- Use absolute paths to make sure they are agnostic to where your code is running from!
  Use the `path` module for that.
*/
const path = require('path');
const id = require("../util/id");
const fs = require('fs');
const log = require("../util/log");
const serialization = require("../util/serialization");
const { emitKeypressEvents } = require('readline');
// create the folder at the root folder
const dirPath = path.resolve(process.cwd(), 'store');
const SecondaryDirPath = path.resolve(process.cwd(), `store/${global.moreStatus['nid']}`);
const AllPath = path.resolve(process.cwd(), `${SecondaryDirPath}/all`);
console.log(SecondaryDirPath);
console.log(AllPath);
function init(callback){
  fs.mkdir(dirPath, (err) => {
    if (err) {
      if (err.code != 'EEXIST') {
        console.error(err);
        return;
      }
    }
    console.log('Directory created successfully!');
    fs.mkdir(SecondaryDirPath,(err)=>{
      console.log(111);
      if (err) {
        if (err.code != 'EEXIST') {
          console.error(err);
          return;
        }
      }
      console.log('Secondary Directory created successfully!');
      fs.mkdir(AllPath,(err)=>{
        if (err) {
          if (err.code != 'EEXIST') {
            console.error(err);
            return;
          }
        }
        console.log('All directory created successfully!');
        callback(null);
      });
    });
  });
}

function put(state, configuration, callback) {
  init((err)=>{
    if (typeof configuration === "string" || configuration == null){
      configuration = {key:configuration};
  }
  if (configuration instanceof Object){
      if (configuration.hasOwnProperty("key")){
          let key = configuration.key;
          if (key == null){ //if key is null
              key = id.getID(state);
          }
          let pathName = key.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
          if (configuration.hasOwnProperty("gid") && configuration.gid!='all'){ //get the gid if it has one
            let gidPath = configuration.gid;
            let thirdDirPath = `${SecondaryDirPath}/${gidPath}`
            // the huge callback that add the file to the directory of the group and all
            fs.mkdir(thirdDirPath, (err) => {
              if (err) {
                if (err.code != 'EEXIST') {
                  console.error(err);
                  return;
                }
              }
              fs.writeFile(`${thirdDirPath}/${pathName}`,serialization.serialize(state),(e)=>{
                if (e){
                  callback(new Error(`error is ${e}`));
                  return;
                }
                callback(null,state);
              })
            }); 
          }else{
            // if the gid is all or it is not provided, just write to the "all" directory
            fs.writeFile(`${AllPath}/${pathName}`,serialization.serialize(state),(e)=>{
              if (e){
                console.log(AllPath);
                console.log(pathName)
                const err = new Error(`error is ${e}`);
                callback(err);
                return;
              }
              callback(null,state);
              return;
            });
          };
          return;
      }
      callback(new Error("Wrong object in local mem put"));
      return;
  }
  callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
  return;
  })
  // if (typeof configuration === "string"){
  //   let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
  //   fs.writeFile(`${SecondaryDirPath}/${pathName}`,serialization.serialize(state),(e)=>{
  //     if (e){
  //       callback(new Error('error is',{source:e}));
  //       return;
  //     }
  //     callback(null,state);
  //     return;
  //   })
  // }else if(configuration == null){
  //   const pathName = id.getID(state);
  //   fs.writeFile(`${SecondaryDirPath}/${pathName}`,serialization.serialize(state),(e)=>{
  //     if (e){
  //       callback(new Error('error is',{source:e}));
  //       return;
  //     }
  //     callback(null,state);
  //     return;
  //   })
  // }else{
  //   callback(new Error("Configuration name is not a string or null"));
  //   return;
  // }

}

function get(configuration, callback) {    
  if (typeof configuration === "string" || configuration == null){
    configuration = {key:configuration};
  }
  if (configuration instanceof Object){
    if (configuration.hasOwnProperty("key")){
      let key = configuration.key;
      let gid = 'all';
      if (configuration.hasOwnProperty("gid")){ //get the gid if it has one
          gid = configuration.gid;
      }
      if (key == null){ //if key is null
        fs.readdir(`${SecondaryDirPath}/${gid}`,(e,v)=>{
          // console.log(gid);
          // console.log(v);
          // log(v,"in local store get")
          if (e && e.code != 'ENOENT'){
            callback(new Error(`error is ${e}`));
            return;
          }
          if (e && e.code == 'ENOENT'){
            fs.mkdir(`${SecondaryDirPath}/${gid}`, (err) => {
              console.log(SecondaryDirPath);
              callback(null,{});
              return;
            })
          }else{
            callback(null,v);
            return;
          }
        })
      }else if (typeof key === "string"){
        //get the specified file;
        let pathName = key.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
        fs.readFile(`${SecondaryDirPath}/${gid}/${pathName}`,'utf8',(e,v)=>{
          if (e){
            callback(new Error(`error is ${e}`));
            return;
          }
          const state = serialization.deserialize(v)
          callback(null,state);
          return;
        })
      } else {
        callback(new Error("Configuration name is not a string or null"));
        return;
      }
    }else{
      callback(new Error("Wrong object in local store get"));
      return;
    }
  }else{
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
}

  // if (typeof configuration === "string"){
  //   let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
  //   fs.readFile(`${SecondaryDirPath}/${pathName}`,'utf8',(e,v)=>{
  //     if (e){
  //       callback(new Error('error is',{source:e}));
  //       return;
  //     }
  //     const state = serialization.deserialize(v)
  //     callback(null,state);
  //     return;
  //   })
  // }else if (configuration == null){
  //   fs.readdir(SecondaryDirPath,(e,v)=>{
  //     if (e){
  //       callback(new Error('error is',{source:e}));
  //       return;
  //     }
  //     callback(null,v);
  //     return;
  //   })
  // }else{
  //   callback(new Error("Configuration name is not a string or null"));
  //   return;
  // }
}

function del(configuration, callback) {
  if (typeof configuration === "string"){
    configuration = {key:configuration};
  }
  if (configuration instanceof Object){
    if (configuration.hasOwnProperty("key")){
      let key = configuration.key;
      let gid = 'all';
      if (configuration.hasOwnProperty("gid")){ //get the gid if it has one
          gid = configuration.gid;
      }
      if (typeof key === "string"){
        //get the specified file
        let pathName = key.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
        fs.readFile(`${SecondaryDirPath}/${gid}/${pathName}`,'utf8',(e,v)=>{
          if (e){
            callback(new Error(`error is ${e}`));
            return;
          }
          const state = serialization.deserialize(v)
          fs.unlink(`${SecondaryDirPath}/${gid}/${pathName}`,(e)=>{
            if (e){
              callback(new Error(`error is ${e}`));
              return;
            }
            callback(null,state)
            return;
          })
        })
      } else {
        callback(new Error("Configuration name is not a string"));
        return;
      }
    }else{
      callback(new Error("Wrong object in local store del"));
      return;
    }
  }else{
    callback(new Error("Input configuration is wrong (not a string, not a null, not an object)"));
    return;
}

  // let pathName = configuration.replace(/[^a-zA-Z0-9]/g, ''); //make it alpha-numeric only
  // if (typeof configuration === "string"){
  //   fs.readFile(`${SecondaryDirPath}/${pathName}`,'utf8',(e,v)=>{
  //     if (e){
  //       callback(new Error('error is',{source:e}));
  //       return;
  //     }
  //     const state = serialization.deserialize(v)
  //     fs.unlink(`${SecondaryDirPath}/${pathName}`,(e)=>{
  //       if (e){
  //         callback(new Error('error is',{source:e}));
  //         return;
  //       }
  //       callback(null,state)
  //       return;
  //     })
  //   })
  // }else{
  //   callback(new Error("Configuration name is not a string or null"));
  //   return;
  // }
}

module.exports = {put, get, del};
