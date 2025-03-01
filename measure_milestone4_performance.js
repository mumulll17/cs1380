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

const mygroupGroup = {};
mygroupGroup[id.getSID(n1)] = n1;
const mygroupConfig = {gid: 'mygroup'};
distribution.local.groups.put(mygroupConfig, mygroupGroup, (e, v) => {

    distribution.mygroup.mem.put({f:"123",l:"456"},"in put", (e,v)=>{
        distribution.mygroup.mem.get("in put", (e,v)=>{
            console.log(e);
            console.log(v)
        })
    })
    // time start
    //
    // mygroup mem put()
    // time end
});