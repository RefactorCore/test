export function cleanCompanyName(name) {
  const legalSuffixes = [
    "pty", "ltd", "llc", "nl", "ltc", "co", "inc", "company",
    "corporation", "corp", "webshop", "group", "limited", "services", "sales",
    "solutions", "systems", "engineering", "engineers", "building", "construction"
  ];

  const countriesAndStates = [
    "au", "aus", "usa", "uk", "can",
    "nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"
  ];

  const ignoreWords = new Set(["the", "and", "&", "of", "in", "child", "family"]);

  // Step 1: Extract domain name if email or URL
  const domainMatch = name.match(/(?:https?:\/\/)?(?:www\.)?([^\/@\s]+)(?:\/|$)/i);
  if (domainMatch) {
    let domain = domainMatch[1]
      .replace(/^www\./, "")
      .replace(/\.(com|net|org|co|au|uk|ph|us|io|biz|info)$/, "")
      .replace(/[^a-zA-Z0-9]/g, "");

    return capitalizeWord(domain);
  }

  // Step 2: Normalize
  let cleaned = name.toLowerCase().replace(/[®]/g, "").trim();

  [...legalSuffixes, ...countriesAndStates].forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "");
  });

  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s{2,}/g, " ").trim();

  const words = cleaned.split(" ").filter(w => w && !ignoreWords.has(w));
  if (words.length === 0) return "";

  const first = words[0];

  // If the first word is all caps or mostly uppercase → likely acronym
  if (/^[A-Z]{2,}$/.test(first.toUpperCase()) || /^[A-Z]{2,}[a-z]*$/.test(name.trim().split(" ")[0])) {
    return first.toUpperCase();
  }

  return capitalizeWord(first);
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
