const http = require('http');
const log = require('../util/log');
const serialization = require('../util/serialization');
const routes = require('./routes');

/*
    The start function will be called to start your node.
    It will take a callback as an argument.
    After your node has booted, you should call the callback.
*/

const start = function(callback) {
  const server = http.createServer((req, res) => {
    /* Your server will be listening for PUT requests. */
    if (req.method === 'PUT'){
    /*
      The path of the http request will determine the service to be used.
      The url will have the form: http://node_ip:node_port/service/method
    */
      const words = req.url.split('/').filter(Boolean);
      let service = words[1]; // service name
      // console.log('get in node.js');
      if (words.length < 3) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(serialization.serialize({ error: 'Invalid URL format' }));
          return;
      }
      if (words[0]!='local'){
        service = {service:words[1],gid:words[0]};
      }
      
      const method = words[2];  // method name
    /*

      A common pattern in handling HTTP requests in Node.js is to have a
      subroutine that collects all the data chunks belonging to the same
      request. These chunks are aggregated into a body variable.

      When the req.on('end') event is emitted, it signifies that all data from
      the request has been received. Typically, this data is in the form of a
      string. To work with this data in a structured format, it is often parsed
      into a JSON object using JSON.parse(body), provided the data is in JSON
      format.

      Our nodes expect data in JSON format.
  */
//  console.log('before body');   
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end',()=>{
      let deserialized = serialization.deserialize(body);
      // console.log(deserialized);
      if (!(deserialized instanceof Array)){ //if it is not an array
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(serialization.serialize({error:Error('Invalid Object'),value:null}));
      }
      /* Here, you can handle the service requests. */

      const serviceName = service;
      routes.get(serviceName, (e, service) => {
        if (e != null) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(serialization.serialize({error:e,value:null})); // Ensure only one res.end() call
        }
        // console.log(service);
        // console.log(method);
          const result = service[method](...deserialized,(e,v)=>{
            // log(v,'buginnode');
            res.end(serialization.serialize({error:e,value:v}));
          });
    });
    

    })
    }


  });


  /*
    Your server will be listening on the port and ip specified in the config
    You'll be calling the `callback` callback when your server has successfully
    started.

    At some point, we'll be adding the ability to stop a node
    remotely through the service interface.
  */
  server.listen(global.nodeConfig.port, global.nodeConfig.ip, () => {
    log(`Server running at http://${global.nodeConfig.ip}:${global.nodeConfig.port}/`);
    global.distribution.node.server = server;
    // console.log(serialization.serialize(callback));
    callback(server);
  });
  server.on('error', (error) => {
    // server.close();
    log(`Server error: ${error}`);
    throw error;
  });

};

module.exports = {
  start: start,
};
