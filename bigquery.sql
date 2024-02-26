CREATE OR REPLACE FUNCTION functions.standardize_address(address STRING)
RETURNS STRING
LANGUAGE js
OPTIONS (
  library=[
    -- The following license applies ONLY to the numbers-from-words-0.0.8-assume-number-1.js UDF
    -- The MIT License (MIT)
    -- Copyright (c) 2015 bitfinexcom
    -- Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    -- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    -- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    -- thanks https://github.com/f3rno64/numbers-from-words
    -- modified here https://github.com/faradayio/numbers-from-words/tree/assume-number-1
    "gs://fdy-bigquery-public-udfs/numbers-from-words-0.0.8-assume-number-1.js"
  ]
)
  
AS """
PLACEHOLDER
""";