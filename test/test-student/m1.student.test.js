/*
    In this file, add your own test cases that correspond to functionality introduced for each milestone.
    You should fill out each test case so it adequately tests the functionality you implemented.
    You are left to decide what the complexity of each test case should be, but trivial test cases that abuse this flexibility might be subject to deductions.

    Imporant: Do not modify any of the test headers (i.e., the test('header', ...) part). Doing so will result in grading penalties.
*/
const distribution = require('../../config.js');
const os = require('os')
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

test('m1: function test', () => {
  const object = function f() {
    return "Hello World";
  };
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(typeof deserialized).toBe('function');
  expect(deserialized()).toBe("Hello World");
});

test('m1: object/array test', () => {
  const object = {a:1,b:2,c:"3",d:[1,2,3], e: {a:1,b:2,c:3}};
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});

test('m1: date test', () => {
  const object = Date.now();
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});

test('m1: error test', () => {
  const object = new Error("Hello World");
  const serialized = distribution.util.serialize(object);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(object);
});

test('m1: cycle object test', () => {
  const x = { a: 1, b: 2, c: 3};
  x.self = x;
  const serialized = distribution.util.serialize(x);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(x);
});

test('m1: native object test', () => {
  const x = os.type;
  
  const serialized = distribution.util.serialize(x);
  const deserialized = distribution.util.deserialize(serialized);

  expect(deserialized).toEqual(x);
});