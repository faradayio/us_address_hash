CREATE OR REPLACE FUNCTION StandardizeAddress(address STRING)
RETURNS STRING
LANGUAGE JAVASCRIPT
AS $$
  // note that first use of input var must be upcased (and then we copy it into normal downcased var)
  function removeSpecialCharactersAndExtraWhitespace(address) {
    return address.replace(/[^a-zA-Z0-9\s]/g, " ").replace(/\s+/g, " ");
  }

  function standardizeDirectionalPrefixes(address) {
    return address.replace(
      /\b(?:(n)(?:orth)?|(s)(?:outh)?|(e)(?:ast)?|(w)(?:est)?)(?: ?(e)(?:ast)?| ?(w)(?:est)?)?\b/gi,
      (match, n, s, e, w, e1, w1) =>
        (n || "") + (s || "") + (e || e1 || "") + (w || w1 || "")
    );
  }

  function standardizeCommonTerms(address) {
    return address
      .replace(/\bstreet\b/gi, "st")
      .replace(/\bavenue\b/gi, "ave")
      .replace(/\bapartment\b/gi, "unit")
      .replace(/\b(apt|suite)\b/gi, "unit")
      .replace(/\bste\b/gi, "unit")
      .replace(/\bp\.?\s?o\.?\sbox\b/gi, "pobox");
  }

  function standardizeStateNames(address) {
    const states = {
      alabama: "AL",
      alaska: "AK",
      arizona: "AZ",
      arkansas: "AR",
      california: "CA",
      colorado: "CO",
      connecticut: "CT",
      delaware: "DE",
      florida: "FL",
      georgia: "GA",
      hawaii: "HI",
      idaho: "ID",
      illinois: "IL",
      indiana: "IN",
      iowa: "IA",
      kansas: "KS",
      kentucky: "KY",
      louisiana: "LA",
      maine: "ME",
      maryland: "MD",
      massachusetts: "MA",
      michigan: "MI",
      minnesota: "MN",
      mississippi: "MS",
      missouri: "MO",
      montana: "MT",
      nebraska: "NE",
      nevada: "NV",
      "new hampshire": "NH",
      "new jersey": "NJ",
      "new mexico": "NM",
      "new york": "NY",
      "north carolina": "NC",
      "north dakota": "ND",
      ohio: "OH",
      oklahoma: "OK",
      oregon: "OR",
      pennsylvania: "PA",
      "rhode island": "RI",
      "south carolina": "SC",
      "south dakota": "SD",
      tennessee: "TN",
      texas: "TX",
      utah: "UT",
      vermont: "VT",
      virginia: "VA",
      washington: "WA",
      "west virginia": "WV",
      wisconsin: "WI",
      wyoming: "WY",
      "puerto rico": "PR",
    };
    for ([key, value] of Object.entries(states)) {
      const regex = new RegExp("\\b" + key + "\\b", "g");
      address = address.replace(regex, value);
    }

    return address;
  }

  function removeZipPlusFour(address) {
    return address.replace(/ \d{5}-\d{4}$/g, "");
  }

  address = ADDRESS.toLowerCase();
  address = removeSpecialCharactersAndExtraWhitespace(address);
  address = standardizeDirectionalPrefixes(address);
  address = standardizeCommonTerms(address);
  address = standardizeStateNames(address);
  address = removeZipPlusFour(address);
  return address.trim();
$$;