CREATE OR REPLACE FUNCTION functions.standardize_address(address STRING)
RETURNS STRING
LANGUAGE js AS """
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
      .replace(/\\bstreet\\b/gi, "st")
      .replace(/\\broad\\b/gi, "rd")
      .replace(/\\btr(?:ai)l\\b/gi, "tr")
      .replace(/\\blane\\b/gi, "ln")
      .replace(/\\bavenue\\b/gi, "ave")
      .replace(/\\bdrive\\b/gi, "dr")
      .replace(/\\bfort\\b/gi, "ft")
      .replace(/\\bapartment\\b/gi, "unit")
      .replace(/\\b(apt|suite)\\b/gi, "unit")
      .replace(/\\bste\\b/gi, "unit")
      .replace(/\\bp\\.?\\s?o\\.?\\sbox\\b/gi, "pobox");
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

  address = address.toLowerCase();
  address = removeSpecialCharactersAndExtraWhitespace(address);
  address = standardizeDirectionalPrefixes(address);
  address = standardizeCommonTerms(address);
  address = standardizeStateNames(address);
  address = removeZipPlusFour(address);
  return address.trim();
""";