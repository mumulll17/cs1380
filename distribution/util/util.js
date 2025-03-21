const serialization = require('./serialization');
const id = require('./id');
const wire = require('./wire');

module.exports = {
  serialize: serialization.serialize,
  deserialize: serialization.deserialize,
  id: id,
  wire: wire,
};
