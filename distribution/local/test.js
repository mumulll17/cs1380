const distribution = require('../../config.js');
const g = {
    '507aa': {ip: '127.0.0.1', port: 8080},
    '12ab0': {ip: '127.0.0.1', port: 8081},
  };

  distribution.local.groups.put('browncs', g, (e, v) => {
    try {
      console.log(e);
      console.log(v);
      console.log(global.distribution);
      console.log('groups');
      console.log(distribution.local.groups);
      for (let v of Object.values(distribution.local.groups.groups)){
        for (let k of Object.keys(v)){
        console.log(v[k]);
        }
      }
    } catch (error) {
        console.log(error);
    }
  });