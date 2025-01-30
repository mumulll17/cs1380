#!/usr/bin/env node

const {exec} = require('child_process');
const fs = require('fs');

// before testing, I want to empty my global_index
fs.writeFile('./d/global-index.txt', '', () => {});

const urlsToTest = [
  'https://cs.brown.edu/courses/csci1380/sandbox/1',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1a/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1b/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1c/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1a/level_2a/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1a/level_2b/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1b/fact_3/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1b/fact_4/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1c/fact_5/index.html',
  'https://cs.brown.edu/courses/csci1380/sandbox/1/level_1c/fact_6/index.html',]
const terms = [
  'centuri instanc',
  'check stuff',
  'govern agenc research',
  'moscow west',
  'zone',
  'check',
  'govern research',
  'calm',
  'caution artist',
];
let num = 0;

// the function to run the crawl script
function crawl(url) {
  return new Promise((resolve, reject) => {
    const command = `./crawl.sh "${url}">d/contents/content${num.toString()}.txt`;
    num++;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error: ${error.message}`));
      }
      if (stderr) {
        return reject(new Error(`stderr: ${stderr}`));
      }
      resolve(stdout);
    });
  });
}

// The function to run the index script
function index(url) {
  return new Promise((resolve, reject) => {
    num--;
    const command = `./index.sh d/contents/content${num.toString()}.txt "${url}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error: ${error.message}`));
      }
      if (stderr) {
        return reject(new Error(`stderr: ${stderr}`));
      }
      resolve(stdout);
    });
  });
}

// The function to run the query
function query(term) {
  return new Promise((resolve, reject) => {
    const command = `./query.js ${term}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(new Error(`Error: ${error.message}`));
      }
      if (stderr) {
        return reject(new Error(`stderr: ${stderr}`));
      }
      resolve(stdout);
    });
  });
}

// run all the crawler
function testCrawlerThroughput() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let crawledCount = 0;
    const crawlPromises = urlsToTest.map((url) => {
      return crawl(url)
          .then(() => {
            crawledCount++;
          })
          .catch((error) => {
            console.error(`Failed to crawl ${url}: ${error}`);
          });
    });

    // Wait for all crawl processes
    Promise.all(crawlPromises).then(() => {
      const totalTime = (Date.now() - startTime) / 1000;
      const throughPut = crawledCount / totalTime;
      console.log(`Crawled ${crawledCount} URLs in ${totalTime} seconds`);
      console.log(`Crawler throughput: ${throughPut} URLs per second`);
      resolve();
    }).catch(reject);
  });
}

function testIndexThroughput() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let indexedCount = 0;

    // Use a promise chain because index needs to be run one at a time
    let promiseChain = Promise.resolve();
    urlsToTest.forEach((url) => {
      promiseChain = promiseChain
          .then(() => {
            return index(url); // Wait for each indexing operation to complete
          })
          .then(() => {
            indexedCount++;
          })
          .catch((error) => {
            console.error(`Failed to index ${url}: ${error}`);
          });
    });

    // After all indexing promises are completed, calculate throughput
    promiseChain.then(() => {
      const totalTime = (Date.now() - startTime) / 1000;
      const throughPut = indexedCount / totalTime;
      console.log(`Indexed ${indexedCount} URLs in ${totalTime} seconds`);
      console.log(`Index throughput: ${throughPut} URLs per second`);
      resolve();
    }).catch(reject);
  });
}

// run all the query processes
function testQueryThroughput() {
  const startTime = Date.now();
  let queryCount = 0;
  const queryPromises = terms.map((term) => {
    return query(term)
        .then(() => {
          queryCount++;
        })
        .catch((error) => {
          console.error(`Failed to query ${term}: ${error}`);
        });
  });

  // Wait for all query processes
  Promise.all(queryPromises).then(() => {
    const totalTime = (Date.now() - startTime) / 1000;
    const throughPut = queryCount / totalTime;
    console.log(`Query ${queryCount} terms in ${totalTime} seconds`);
    console.log(`Query throughput: ${throughPut} queries per second`);
  });
}

// Since await is not allowed, have to use then and catch
function main() {
  testCrawlerThroughput()
      .then(() => {
        return testIndexThroughput(); // Wait for crawling to finish before starting indexing
      })
      .then(() => {
        return testQueryThroughput(); // Wait for indexing to finish before starting queries
      })
      .catch((error) => {
        console.error('Error during throughput tests:', error);
      });
}

main();
