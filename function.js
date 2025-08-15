import { parse } from "numbers-from-words";

function standardizeDirectionalPrefixes(address) {
  return address.replace(
    /\b(?:(n)(?:orth)?|(s)(?:outh)?|(e)(?:ast)?|(w)(?:est)?)(?: ?(e)(?:ast)?| ?(w)(?:est)?)?(\d+)?\b/gi,
    (match, n, s, e, w, e1, w1, d) =>
      (n || "") +
      (s || "") +
      (e || e1 || "") +
      (w || w1 || "") +
      (d ? ` ${d}` : "")
  );
}

function standardizeUnitNumber(address) {
  return address
    .replace(
      /\b(\d+)?(?:apt|suite|apartment|ste|spc?|space)(?:(\d+)|\b)/g,
      " unit $1$2"
    )
    .replace(/\b([a-z])(\d+)\b/, "$2$1")
    .replace(/\#/g, " unit ");
}

function standardizeCommonTerms(address) {
  return address
    .replace(/ ?pl(?:anes)?\b/g, " pl")
    .replace(/ ?(?:ridge|rdg)s?\b/g, " rdg")
    .replace(/ ?(?:garden|gdn)s?\b/g, " garden")
    .replace(/ ?market?\b/g, " mkt")
    .replace(/ ?greens?\b/g, " grn")
    .replace(/ ?woods?\b/g, " wood")
    .replace(/\b(?:passage|psge)\b/g, " psg")
    .replace(/\bfort\b/g, " ft")
    .replace(/\bp\.?\s?o\.?\sbox\b/g, " pobox")
    .replace(/\bsaint\b/g, " st");
}

function standardizeStreetSuffixes(address) {
  return address
    .replace(
      /\b(?:avenue|ave|court|ct|drive|dr|lane|ln|circle|cir|place|pl|loop|lp|road|rd|boulevard|blvd|parkway|pkway|pkwy|street|st|ter(?:race)|tr|(?:us)?\s*(?:hwy|highway|route)|tr(?:ai)l|trl)\s+unit\b/g,
      " street unit"
    )
    .replace(
      /\b(?:avenue|ave|court|ct|drive|dr|lane|ln|circle|cir|place|pl|loop|lp|road|rd|boulevard|blvd|parkway|pkway|pkwy|street|st|ter(?:race)|tr|(?:us)?\s*(?:hwy|highway|route)|tr(?:ai)l|trl)(?:\s*|\s*(?:n|e|w|s))$/g,
      " street"
    );
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
  for (const [key, value] of Object.entries(states)) {
    const regex = new RegExp("\\b" + key + "\\b", "g");
    address = address.replace(regex, value);
  }

  return address;
}

function removeZipPlusFour(address) {
  return address.replace(/ \d{5}-\d{4}$/g, "");
}

function removeTrailingStuff(address) {
  return address.replace(/ (?:street)? ?(?:n|s|e|w)?$/g, "");
}

function removeOrdinalSuffixes(address) {
  return address.replace(/\b(\d+) ?(st|nd|rd|th)\b/g, "$1");
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
  "thousand",
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
  const words = text.split(/\s+/);
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
  // console.log("address.toLowerCase() " + address);
  address = address.replace(/[^a-zA-Z0-9\s#]/g, " ");
  // console.log('address.replace(/[^a-zA-Z0-9s#]/g, " ") ' + address);
  address = replaceNumberWordsWithNumerals(address);
  // console.log("replaceNumberWordsWithNumerals(address) " + address);
  address = standardizeDirectionalPrefixes(address);
  // console.log("standardizeDirectionalPrefixes(address) " + address);
  address = standardizeUnitNumber(address);
  // console.log("standardizeUnitNumber(address) " + address);
  address = standardizeStreetSuffixes(address);
  // console.log("standardizeStreetSuffixes(address) " + address);
  address = standardizeCommonTerms(address);
  // console.log("standardizeCommonTerms(address) " + address);
  address = standardizeStateNames(address);
  // console.log("standardizeStateNames(address) " + address);
  address = removeZipPlusFour(address);
  // console.log("removeZipPlusFour(address) " + address);
  address = removeOrdinalSuffixes(address);
  // console.log("removeOrdinalSuffixes(address) " + address);
  address = removeTrailingStuff(address);
  // console.log("removeTrailingStuff(address) " + address);
  address = address.replace(/\s+/g, " ");
  return address.trim();
}

//! REMOVE THIS FOR BIGQUERY
module.exports = {
  standardizeAddress,
};
