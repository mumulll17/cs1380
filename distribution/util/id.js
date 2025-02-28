/** @typedef {import("../types.js").Node} Node */

const assert = require('assert');
const crypto = require('crypto');

// The ID is the SHA256 hash of the JSON representation of the object
/** @typedef {!string} ID */

/**
 * @param {any} obj
 * @return {ID}
 */
function getID(obj) {
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(obj));
  return hash.digest('hex');
}

/**
 * The NID is the SHA256 hash of the JSON representation of the node
 * @param {Node} node
 * @return {ID}
 */
function getNID(node) {
  node = {ip: node.ip, port: node.port};
  return getID(node);
}

/**
 * The SID is the first 5 characters of the NID
 * @param {Node} node
 * @return {ID}
 */
function getSID(node) {
  return getNID(node).substring(0, 5);
}


function getMID(message) {
  const msg = {};
  msg.date = new Date().getTime();
  msg.mss = message;
  return getID(msg);
}

function idToNum(id) {
  const n = parseInt(id, 16);
  assert(!isNaN(n), 'idToNum: id is not in KID form!');
  return n;
}

function naiveHash(kid, nids) {
  nids.sort();
  return nids[idToNum(kid) % nids.length];
}

function consistentHash(kid, nids) {
  const kidNum = idToNum(kid);
  const nidMap = {};
  for (const nid of nids) {
    nidMap[idToNum(nid)] = nid;
  }
  const nidNums = Object.keys(nidMap);
  nidNums.push(kidNum);
  nidNums.sort();
  const ind = nidNums.indexOf(kidNum);
  if (ind==nidNums.length-1){
    ind = -1;
  }
  return nidMap[nidNums[ind+1]];
}


function rendezvousHash(kid, nids) {
  const nidMap = {}
  const kidNidNums = [];
  for (let nid of nids){
    const kidNid = kid+nid;
    let hashed = getID(kidNid);
    let num = idToNum(hashed);
    nidMap[num] = nid;
    kidNidNums.push(num);
  }
  kidNidNums.sort();
  const maxV = Math.max(...kidNidNums);
  return nidMap[maxV];
}

module.exports = {
  getID,
  getNID,
  getSID,
  getMID,
  naiveHash,
  consistentHash,
  rendezvousHash,
};
