#!/usr/bin/env node

/*
 Combine terms to create  n-grams (for n=1,2,3) and then count and sort them
 Usage: ./combine.js <terms > n-grams
*/

const readline = require('readline');

// Function to create bigrams
function bigrams(input) {
  const result = [];
  for (let i = 0; i < input.length - 1; i++) {
    result.push(`${input[i]} ${input[i + 1]}`);
  }
  return result.sort();
}

// Function to create trigrams
function trigrams(input) {
  const result = [];
  for (let i = 0; i < input.length - 2; i++) {
    result.push(`${input[i]} ${input[i + 1]} ${input[i + 2]}`);
  }
  return result.sort();
}

const lines = [];

// Read input line by line
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line)=>{
  lines.push(...line.trim().split(/\s+/));
});
// Generate unigrams, bigrams, and trigrams

rl.on('close', ()=>{
  const unigrams = [...lines].sort();
  const bigramResult = bigrams(lines);
  const trigramResult = trigrams(lines);
  const result = unigrams.join('\n').trim() + '\n' + bigramResult.join('\n').trim() + '\n' + trigramResult.join('\n').trim();
  console.log(result);
});

