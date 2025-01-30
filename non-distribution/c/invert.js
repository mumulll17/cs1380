#!/usr/bin/env node

const readline = require('readline');

// Read input line by line
const rl = readline.createInterface({
  input: process.stdin,
});
const url = process.argv[2];
const lines = {};
rl.on('line', (line)=>{
  const squeezedLine = line.replace(/\s+/g, ' '); // first squeeze the line
  if (squeezedLine in lines) {
    lines[squeezedLine]++; // increment the count if in the map
  } else {
    lines[squeezedLine] = 1;
  }
});
const result = [];
rl.on('close', ()=>{
  for (const line in lines) {
    result.push(line+' | '+lines[line]+' | '+url);
  }
  console.log(result.join('\n'));
});
