#!/bin/bash

T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/../..$R_FOLDER" || exit 1

DIFF=${DIFF:-diff}

url="https://cs.brown.edu/courses/csci1380/sandbox/2/static/book3.txt"

if $DIFF <(cat "$T_FOLDER"/d/ts_getTextIn_getUrlIn.txt | c/getURLs.js $url | sort) <(sort "$T_FOLDER"/d/ts_getUrlO.txt) >&2;
then
    echo "$0 success: URL sets are identical"
    exit 0
else
    echo "$0 failure: URL sets are not identical"
    exit 1
fi
