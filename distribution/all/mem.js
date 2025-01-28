const distribution = global.distribution;
const util = distribution.util;


function mem(config) {
  const context = {};
  context.gid = config.gid || 'all';
  context.hash = config.hash || util.id.naiveHash;

  /* For the distributed mem service, the configuration will
          always be a string */
  return {
    get: (configuration, callback) => {
    },

    put: (state, configuration, callback) => {
    },

    del: (configuration, callback) => {
    },

    reconf: (configuration, callback) => {
    },
  };
};

module.exports = mem;
