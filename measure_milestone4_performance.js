const { count } = require('yargs');
const distribution = require('./config');
const id = distribution.util.id;

const user = [];
function generateRandomName() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randomString = (length) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    const firstLength = Math.floor(Math.random() * 10) + 3; // Random length between 3 and 12
    const lastLength = Math.floor(Math.random() * 12) + 3;  // Random length between 3 and 14
    const keyLength = Math.floor(Math.random() * 7) + 3
    return {
        first: randomString(firstLength), // Generate a 6-character random first name
        last: randomString(lastLength),   // Generate an 8-character random last name
    };
}
function generateRandomKey() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const randomString = (length) => Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    const keyLength = Math.floor(Math.random() * 7) + 3
    return randomString(keyLength);
}
const randomObj = Array.from({ length: 1000 }, generateRandomName);
const randomKey = Array.from({ length: 1000 }, generateRandomKey);

const n1 = {ip: '52.15.200.52', port: 1234};
const n2 = {ip: '3.149.234.117', port: 1234};
const n3 = {ip: '18.223.108.104', port: 1234};

const mygroupGroup = {};
mygroupGroup[id.getSID(n1)] = n1;
mygroupGroup[id.getSID(n2)] = n2;
mygroupGroup[id.getSID(n3)] = n3;
const mygroupConfig = {gid: 'mygroup'};

distribution.local.groups.put(mygroupConfig, mygroupGroup, (e, v) => {
    let startTime = performance.now();
    let counter1 = 0;
    for (let i = 0; i<1000; i++){
        distribution.mygroup.mem.put(randomObj[i], randomKey[i], (e, v) => {
            counter1++;
            if (counter1==1000){
                let middleTime = performance.now();
                let elapsedTime = middleTime-startTime;
                console.log(`elapsed time for mem put is ${elapsedTime}, throuput:${1000/elapsedTime}, latency:${elapsedTime/1000}`);
                for (let j = 0; j<1000;j++){
                    distribution.mygroup.mem.get(randomKey[j], (e, v) => {
                        counter1--;
                        if (counter1 == 0){
                            let endTime = performance.now();
                            let elapsedTime2 = endTime-middleTime;
                            console.log(`elapsed time for mem get is ${elapsedTime2}, throuput:${1000/elapsedTime2}, latency:${elapsedTime2/1000}`);
                        }
                    });
                }
            }
        });
    }

});