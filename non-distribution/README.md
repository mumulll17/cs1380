# non-distribution

This milestone aims (among others) to refresh (and confirm) everyone's
background on developing systems in the languages and libraries used in this
course.

By the end of this assignment you will be familiar with the basics of
JavaScript, shell scripting, stream processing, Docker containers, deployment
to AWS, and performance characterization—all of which will be useful for the
rest of the project.

Your task is to implement a simple search engine that crawls a set of web
pages, indexes them, and allows users to query the index. All the components
will run on a single machine.

## Getting Started

To get started with this milestone, run `npm install` inside this folder. To
execute the (initially unimplemented) crawler run `./engine.sh`. Use
`./query.js` to query the produced index. To run tests, do `npm run test`.
Initially, these will fail.

### Overview

The code inside `non-distribution` is organized as follows:

```
.
├── c            # The components of your search engine
├── d            # Data files like the index and the crawled pages
├── s            # Utility scripts for linting and submitting your solutions
├── t            # Tests for your search engine
├── README.md    # This file
├── crawl.sh     # The crawler
├── index.sh     # The indexer
├── engine.sh    # The orchestrator script that runs the crawler and the indexer
├── package.json # The npm package file that holds information like JavaScript dependencies
└── query.js     # The script you can use to query the produced global index
```

### Submitting

To submit your solution, run `./scripts/submit.sh` from the root of the stencil. This will create a
`submission.zip` file which you can upload to the autograder.


# M0: Setup & Centralized Computing

> Add your contact information below and in `package.json`.

* name: `<Xiangxi Mu>`

* email: `<xiangxi_mu@brown.edu>`

* cslogin: `<mxiangxi>`


## Summary

> Summarize your implementation, including the most challenging aspects; remember to update the `report` section of the `package.json` file with the total number of hours it took you to complete M0 (`hours`), the total number of JavaScript lines you added, including tests (`jsloc`), the total number of shell lines you added, including for deployment and testing (`sloc`).


My implementation consists of about `<30>` components addressing T1--8. The most challenging aspect was `<coding the scripts and javascript files>` because `<I am very rusty at coding at both unix script and javascript. And many problems I can't think of one function to solve. It took a lot of effort on study and search>`.

I have also done the first extra credit. The three js files are in the ./c folder.

## Correctness & Performance Characterization


> Describe how you characterized the correctness and performance of your implementation.


To characterize correctness, we developed `<eight tests>` that test the following cases:  I tested all eight functions. Combine, getText, getURLs, invert, merge, process, stem, and query on a different copera which is the second website. And they all worked as expected. These test are all on new txt test files inside the d folder.


*Performance*: The throughput of various subsystems is described in the `"throughput"` portion of package.json. The characteristics of my development machines are summarized in the `"dev"` portion of package.json.

Just to add on the performance, the throughput is for unit per second. I tested it with one file called test_throughput. This single file run the whole pipeline on 10 urls in total. For crawl, it took 7.705 seconds to crawl 10 urls. For index, it took 31.739 seoconds to index 10 urls. For queryI query 9 sets of terms in 2.697 seconds. The only slower element is the index, and it makes sense because when the global_index gets larger, it takes more time to merge.

## Wild Guess

> How many lines of code do you think it will take to build the fully distributed, scalable version of your search engine? Add that number to the `"dloc"` portion of package.json, and justify your answer below.

I wrote 10000 lines of code. I think for the fully distributed scalable version, there must be many optimization and error handling methods which would be a lot of code. For the code of the distributed part, it needs to include many problems like storage, memory, communication, and so on. Many other features should also be added.