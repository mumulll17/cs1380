/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/

const distribution = require('../../config.js');

const id = distribution.util.id;

test('(1 pts) put and get in same group', (done) => {
  const user = {first: 'Alice', last: 'Smith'};
  const key = 'alicekey';

  distribution.mygroup.mem.put(user, key, (e, v) => {
    expect(e).toBeFalsy();
    distribution.mygroup.mem.get(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(1 pts) put and delete in same group', (done) => {
  const user = {first: 'Bob', last: 'Johnson'};
  const key = 'bobkey';

  distribution.mygroup.mem.put(user, key, (e, v) => {
    expect(e).toBeFalsy();
    distribution.mygroup.mem.del(key, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

test('(1 pts) get non-existent key', (done) => {
  distribution.mygroup.mem.get('nonexistent', (e, v) => {
    try {
      expect(e).toBeInstanceOf(Error);
      expect(v).toBeFalsy();
      done();
    } catch (error) {
      done(error);
    }
  });
});
test('(1 pts) all.store.put/get(two users)', (done) => {
  const user1 = {first: 'Josiah', last: 'Carberry'};
  const user2 = {first: 'Gus', last: 'Fring'};
  const key1 = 'jcarbmpg';
  const key2 = 'gfringmpg';

distribution.mygroup.store.put(user1, key1, (e, v) => {
  distribution.mygroup.store.put(user2, key2, (e, v) => {
    distribution.mygroup.store.get(key1, (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user1);
      } catch (error) {
        return done(error);
      }
      
      distribution.mygroup.store.get(key2, (e, v) => {
        try {
          expect(e).toBeFalsy();
          expect(v).toEqual(user2);
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });
});

});
test('(1 pts) put without key', (done) => {
  const user = {first: 'Charlie', last: 'Brown'};

  distribution.mygroup.mem.put(user, null, (e, v) => {
    distribution.mygroup.mem.get(id.getID(user), (e, v) => {
      try {
        expect(e).toBeFalsy();
        expect(v).toEqual(user);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});

/*
    Following is the setup for the tests.
*/

const mygroupGroup = {};

/*
   This is necessary since we can not
   gracefully stop the local listening node.
   This is because the process that node is
   running in is the actual jest process
*/
let localServer = null;

const n1 = {ip: '127.0.0.1', port: 9001};
const n2 = {ip: '127.0.0.1', port: 9002};
const n3 = {ip: '127.0.0.1', port: 9003};
const n4 = {ip: '127.0.0.1', port: 9004};
const n5 = {ip: '127.0.0.1', port: 9005};
const n6 = {ip: '127.0.0.1', port: 9006};

beforeAll((done) => {
  // First, stop the nodes if they are running
  const remote = {service: 'status', method: 'stop'};

  const fs = require('fs');
  const path = require('path');

  fs.rmSync(path.join(__dirname, '../store'), {recursive: true, force: true});
  fs.mkdirSync(path.join(__dirname, '../store'));

  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n4;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n5;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n6;
            distribution.local.comm.send([], remote, (e, v) => {
              console.log(111);
              startNodes();
            });
          });
        });
      });
    });
  });

  const startNodes = () => {
    console.log(2222);
    mygroupGroup[id.getSID(n1)] = n1;
    mygroupGroup[id.getSID(n2)] = n2;
    mygroupGroup[id.getSID(n3)] = n3;
    mygroupGroup[id.getSID(n4)] = n4;
    mygroupGroup[id.getSID(n5)] = n5;

    // Now, start the nodes listening node
    distribution.node.start((server) => {
      console.log(33333);
      localServer = server;

      const groupInstantiation = () => {
        const mygroupConfig = {gid: 'mygroup'};

        // Create the groups
        distribution.local.groups.put(mygroupConfig, mygroupGroup, (e, v) => {
          distribution.mygroup.groups
              .put(mygroupConfig, mygroupGroup, (e, v) => {
                done();
              });
        });
      };

      // Start the nodes
      distribution.local.status.spawn(n1, (e, v) => {
        distribution.local.status.spawn(n2, (e, v) => {
          distribution.local.status.spawn(n3, (e, v) => {
            distribution.local.status.spawn(n4, (e, v) => {
              distribution.local.status.spawn(n5, (e, v) => {
                distribution.local.status.spawn(n6, (e, v) => {
                  console.log(1111111);
                  groupInstantiation();
                });
              });
            });
          });
        });
      });
    });
  };
});

afterAll((done) => {
  const remote = {service: 'status', method: 'stop'};
  remote.node = n1;
  distribution.local.comm.send([], remote, (e, v) => {
    remote.node = n2;
    distribution.local.comm.send([], remote, (e, v) => {
      remote.node = n3;
      distribution.local.comm.send([], remote, (e, v) => {
        remote.node = n4;
        distribution.local.comm.send([], remote, (e, v) => {
          remote.node = n5;
          distribution.local.comm.send([], remote, (e, v) => {
            remote.node = n6;
            distribution.local.comm.send([], remote, (e, v) => {
              localServer.close();
              done();
            });
          });
        });
      });
    });
  });
});
