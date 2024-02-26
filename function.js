//import { parse } from "numbers-from-words";
//SyntaxError: Cannot use import statement outside a module

import { parse } from "numbers-from-words";

// FIXME it would be nice if this was de-duplicated with the one in the
// bigquery.sql
// and i could just run "npm test"

// note that slashes e.g. \\s must be doubled
function removeSpecialCharactersAndExtraWhitespace(address) {
  return address.replace(/[^a-zA-Z0-9\\s]/g, " ").replace(/\\s+/g, " ");
}

function standardizeDirectionalPrefixes(address) {
  return address.replace(
    /\\b(?:(n)(?:orth)?|(s)(?:outh)?|(e)(?:ast)?|(w)(?:est)?)(?: ?(e)(?:ast)?| ?(w)(?:est)?)?\\b/gi,
    (match, n, s, e, w, e1, w1) =>
      (n || "") + (s || "") + (e || e1 || "") + (w || w1 || "")
  );
}

function standardizeCommonTerms(address) {
  return address
    .replace(/\\b(apt|suite|apartment|ste)\\b/g, "unit")
    .replace(/\\bavenue\\b/g, "ave")
    .replace(/\\bcourt\\b/g, "ct")
    .replace(/\\bdrive\\b/g, "dr")
    .replace(/\\bfort\\b/g, "ft")
    .replace(/\\blane\\b/g, "ln")
    .replace(/\\bp\\.?\\s?o\\.?\\sbox\\b/g, "pobox")
    .replace(/\\bplace\\b/g, "pl")
    .replace(/\\broad\\b/g, "rd")
    .replace(/\\bstreet\\b/g, "st")
    .replace(/\\bterrace\\b/g, "tr")
    .replace(/\\btr(?:ai)l\\b/g, "trl");
}

function standardizeStateNames(address) {
  const states = {
    alabama: "al",
    alaska: "ak",
    arizona: "az",
    arkansas: "ar",
    california: "ca",
    colorado: "co",
    connecticut: "ct",
    delaware: "de",
    florida: "fl",
    georgia: "ga",
    hawaii: "hi",
    idaho: "id",
    illinois: "il",
    indiana: "in",
    iowa: "ia",
    kansas: "ks",
    kentucky: "ky",
    louisiana: "la",
    maine: "me",
    maryland: "md",
    massachusetts: "ma",
    michigan: "mi",
    minnesota: "mn",
    mississippi: "ms",
    missouri: "mo",
    montana: "mt",
    nebraska: "ne",
    nevada: "nv",
    "new hampshire": "nh",
    "new jersey": "nj",
    "new mexico": "nm",
    "new york": "ny",
    "north carolina": "nc",
    "north dakota": "nd",
    ohio: "oh",
    oklahoma: "ok",
    oregon: "or",
    pennsylvania: "pa",
    "rhode island": "ri",
    "south carolina": "sc",
    "south dakota": "sd",
    tennessee: "tn",
    texas: "tx",
    utah: "ut",
    vermont: "vt",
    virginia: "va",
    washington: "wa",
    "west virginia": "wv",
    wisconsin: "wi",
    wyoming: "wy",
    "puerto rico": "pr",
  };
  for ([key, value] of Object.entries(states)) {
    const regex = new RegExp("\\\\b" + key + "\\\\b", "g");
    address = address.replace(regex, value);
  }

  return address;
}

function removeZipPlusFour(address) {
  return address.replace(/ \\d{5}-\\d{4}$/g, "");
}

const allNumbers = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
  "hundred",
  // Ordinals
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeenth",
  "eighteenth",
  "nineteenth",
  "twentieth",
  "thirtieth",
  "fortieth",
  "fiftieth",
  "sixtieth",
  "seventieth",
  "eightieth",
  "ninetieth",
  "hundredth",
];
const ordinalToCardinalMap = {
  first: "one",
  second: "two",
  third: "three",
  fourth: "four",
  fifth: "five",
  sixth: "six",
  seventh: "seven",
  eighth: "eight",
  ninth: "nine",
  tenth: "ten",
  eleventh: "eleven",
  twelfth: "twelve",
  thirteenth: "thirteen",
  fourteenth: "fourteen",
  fifteenth: "fifteen",
  sixteenth: "sixteen",
  seventeenth: "seventeen",
  eighteenth: "eighteen",
  nineteenth: "nineteen",
  twentieth: "twenty",
  thirtieth: "thirty",
  fortieth: "forty",
  fiftieth: "fifty",
  sixtieth: "sixty",
  seventieth: "seventy",
  eightieth: "eighty",
  ninetieth: "ninety",
  hundredth: "hundred",
};

function replaceNumberWordsWithNumerals(text) {
  const words = text.split(/\\s+/);
  let resultText = [];
  let numberSequence = [];
  let collectingNumber = false;
  words.forEach((word) => {
    // Check and replace ordinal numbers with their cardinal counterparts
    if (ordinalToCardinalMap.hasOwnProperty(word)) {
      word = ordinalToCardinalMap[word]; // Replace the word in the sequence with its cardinal counterpart
    }
    if (allNumbers.indexOf(word) > -1) {
      // Start or continue collecting a number sequence
      numberSequence.push(word);
      collectingNumber = true;
    } else {
      if (collectingNumber) {
        // End of a number sequence, process it
        const numericEquivalent = parse(numberSequence.join(" "));
        resultText.push(numericEquivalent);
        numberSequence = []; // Reset for the next sequence
        collectingNumber = false;
      }
      // If it's not part of a number, add it directly to the result
      if (!collectingNumber) {
        resultText.push(word);
      }
    }
  });
  // Handle case where text ends with a number sequence
  if (collectingNumber) {
    const numericEquivalent = parse(numberSequence.join(" "));
    resultText.push(numericEquivalent);
  }
  return resultText.join(" ");
}

function standardizeAddress(address) {
  address = address.toLowerCase();
  address = removeSpecialCharactersAndExtraWhitespace(address);
  address = standardizeDirectionalPrefixes(address);
  address = standardizeCommonTerms(address);
  address = standardizeStateNames(address);
  address = removeZipPlusFour(address);
  address = replaceNumberWordsWithNumerals(address);
  return address.trim();
}

console.log(standardizeAddress("160 4th ave chula vista ca"));
