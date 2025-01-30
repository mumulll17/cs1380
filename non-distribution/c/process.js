#!/usr/bin/env node

/**
 * Convert input to a stream of non-stopword terms
 * Usage: ./process.js < input > output
 *
 * Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
 * Commands that will be useful: tr, iconv, grep
 */

const iconv = require('iconv-lite');
const readline = require('readline');
const fs = require('fs');

// get the stopwords
const stopwords = fs.readFileSync('d/stopwords.txt', 'utf8').split('\n').map((word) => word.trim());

const rl = readline.createInterface({
  input: process.stdin,
});

let texts = '';
rl.on('line', (line) => {
  // only keep letters
  let words = line.replace(/[^a-zA-Z]+/g, '\n').trim().toLowerCase();
  // Convert to ASCII
  const asciiBuffer = iconv.encode(words, 'ASCII'); // Converts to an ASCII buffer
  words = asciiBuffer.toString(); // Convert the buffer to a string
  const wordsArr = words.split('\n');
  const wordsFiltered = wordsArr.filter((word)=>!stopwords.includes(word));
  words = wordsFiltered.join('\n');
  texts += words+'\n';
});

rl.on('close', ()=>{
  const squeezedText = texts.replace(/\n+/g, '\n');
  console.log(squeezedText.trim());
});
