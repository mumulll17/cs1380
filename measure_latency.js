const util = require('./distribution/util/util.js');

// first create an objects array
const objectArr = [
    42, 
    'Hello, World!', 
    {a: 1, b: 2, c: 3}, 
    {a: 1, b: 2, c: 3, d: {e: 4, f: 5, g: 6}},
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 5, [6, 7, 8, 9, 10]],
    [1, 2, 3, 4, 5, [6, 7, 8, 9, 10], {a: 1, b: 2, c: 3}],
    new Error('Hello, World!'),
    new Date(),
    undefined,
    null,
    (a, b) => a + b,
    {
        n: 1,
        s: 'Hello, World!',
        a: [1, 2, 3, 4, 5],
        e: new Error('Hello, World!'),
        d: new Date(),
        o: {x: 1, y: 2, z: 3},
        n: null,
        u: undefined,
    },
    true,
    false,
    [27, null, undefined, 'string', true, false, {}, []],
];

let totalTime = 0;

for (let i = 0; i < objectArr.length; i++){
    let object = objectArr[i];
    let startTime = performance.now();
    let serialized = util.serialize(object);
    let deserialized = util.deserialize(serialized);
    // console.log(deserialized)
    let endTime = performance.now();
    totalTime += endTime - startTime;
    // console.log(totalTime)
}

console.log(totalTime/objectArr.length)