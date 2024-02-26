import { test, expect } from "vitest";
import { standardizeAddress } from "./function";
import fs from "fs";
import path from "path";
import csv from "neat-csv";

const csvData = fs.readFileSync(path.join(__dirname, "test.csv"), "utf8");
const rows = await csv(csvData);
for (const row of rows) {
  test(`standardizeAddress(${row.input})`, () => {
    const result = standardizeAddress(row.input);
    expect(result).toEqual(row.expected_output);
  });
}

// test("do thing", () => {
//   const result = standardizeAddress("oiajsdoijasd");
//   expect(result).toEqual("thing");
// });

// FIXME for every row in test.csv, run function on "input" and compare to "expected_output"
