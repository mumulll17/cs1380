/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');
const local = distribution.local;
const id = distribution.util.id;

test('(1 pts) student test (routes put get rem)', (done) => {
  // Fill out this test case...
  const addService = {};

  addService.add = (a,b) => {
    return a+b;
  };

  local.routes.put(addService, 'add', (e, v) => {
    local.routes.get('add', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.add(2,3)).toBe(5);
      } catch (error) {
        done(error);
      }
    });
  });
  local.routes.rem('nothing', (e,v)=>{
    try {
      expect(e).toBeFalsy();;
      expect(v).toBe(null);
      done();
    } catch (error) {
      done(error);
    }
  })
});


test('(1 pts) student test (routes put get rem)', (done) => {
  const addService = {};

  addService.add = (a,b) => {
    return a+b;
  };

  local.routes.put(addService, 'add', (e, v) => {
    local.routes.get('add', (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v.add(2,3)).toBe(5);
      } catch (error) {
        done(error);
      }
    });
  });
  local.routes.rem('add', (e,v)=>{
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(addService);
      done();
    } catch (error) {
      done(error);
    }
  })
});


test('(1 pts) student test (status get)', (done) => {
  local.status.get('nothing', (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) student test (comm send status get)', (done) => {
  const node = distribution.node.config;
  const remote = {node: node, service: 'status', method: 'get'};
  const message = ['ip'];

  local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeFalsy();
      expect(v).toBe(node.ip);
      done();
    } catch (error) {
      done(error);
    }
  });
});

test('(1 pts) student test', (done) => {
  const node = distribution.node.config;
  const remote = {node: node, service: 'routes', method: 'get'};
  const message = ['what'];

  local.comm.send(message, remote, (e, v) => {
    try {
      expect(e).toBeTruthy();
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});

/* Test infrastructure */

let localServer = null;

beforeAll((done) => {
  distribution.node.start((server) => {
    localServer = server;
    done();
  });
});

afterAll((done) => {
  localServer.close();
  done();
});
