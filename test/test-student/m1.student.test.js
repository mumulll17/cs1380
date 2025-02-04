
/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
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
