/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
*/

const distribution = require('../config.js');

// M1 Test Cases

test('m1: int test', () => {
  const object = 12345678;
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});
test('m1: string test', () => {
  const object = "12345678";
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});
test('m1: boolean test', () => {
  const object = false;
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});
test('m1: null test', () => {
  const object = null;
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});
test('m1: undefined test', () => {
  const object = undefined;
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});
// M2 Test Cases

// M3 Test Cases

// M4 Test Cases

// M5 Test Cases
