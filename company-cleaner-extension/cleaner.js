export function cleanCompanyName(name) {
  const legalSuffixes = [
    "pty", "ltd", "llc", "nl", "ltc", "co", "inc", "company",
    "corporation", "corp", "webshop", "group", "limited", "services", "sales",
    "solutions", "systems", "engineering", "engineers"
  ];

  const countryOrState = [
    "au", "aus", "usa", "uk", "can",
    "nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"
  ];

  const ignoreWords = new Set(["the", "and", "&", "of", "in", "child", "family"]);

  // Step 1: Extract from domain if URL or email
  const domainMatch = name.match(/(?:https?:\/\/)?(?:www\.)?([^\/@\s]+)(?:\/|$)/i);
  if (domainMatch) {
    let domain = domainMatch[1]
      .replace(/^www\./, "")
      .replace(/\.(com|net|org|co|au|uk|ph|us|io|biz|info)$/, "")
      .replace(/[^a-zA-Z0-9]/g, "");

    return capitalizeWord(domain);
  }

  // Step 2: Clean and remove noise words
  let cleaned = name.toLowerCase().replace(/[®]/g, "").trim();

  [...legalSuffixes, ...countryOrState].forEach(word => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "");
  });

  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s{2,}/g, " ").trim();

  const words = cleaned.split(" ").filter(w => w && !ignoreWords.has(w));

  if (words.length === 0) return "";

  return capitalizeWord(words[0]);
}

function capitalizeWord(word) {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}
