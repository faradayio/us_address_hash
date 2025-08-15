import { test, expect } from "vitest";
import { standardizeAddress } from "./function";
import fs from "fs";
import path from "path";
import csv from "neat-csv";

const csvData = fs.readFileSync(path.join(__dirname, "test.csv"), "utf8");
const rows = await csv(csvData);
for (const row of rows) {
  if (row.skip === "y") {
    continue;
  }
  test(`${row.a} ~ ${row.b}`, () => {
    expect(standardizeAddress(row.a)).toEqual(standardizeAddress(row.b));
  });
}

// test("do thing", () => {
//   const result = standardizeAddress("oiajsdoijasd");
//   expect(result).toEqual("thing");
// });

// FIXME for every row in test.csv, run function on "input" and compare to "expected_output"
