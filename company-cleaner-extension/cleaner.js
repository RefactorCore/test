export function cleanCompanyName(name) {
  const removeWords = [
    "pty", "ltd", "llc", "nl", "ltc", "co", "inc", "company",
    "corporation", "corp", "webshop", "group", "limited", "services", "australia",
    "sales", "solutions", "systems", "engineering", "engineers"
  ];

  const stateOrCountry = ["au", "aus", "usa", "uk", "can", "nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"];

  const ignoreWords = new Set(["the", "and", "&", "of", "in", "child", "family"]);

  // Step 1: Normalize and lowercase
  let cleaned = name.toLowerCase().replace(/[®]/g, "").trim();

  // Step 2: Remove suffixes and common fillers
  [...removeWords, ...stateOrCountry].forEach(word => {
    const pattern = new RegExp(`\\b${word}\\b`, "gi");
    cleaned = cleaned.replace(pattern, "");
  });

  // Step 3: Normalize spacing and clean symbols
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s{2,}/g, " ").trim();

  // Step 4: Split into words
  const words = cleaned.split(" ").filter(w => !ignoreWords.has(w));

  // Handle CamelCase: split those into pseudo-words
  let expandedWords = [];
  words.forEach(word => {
    if (/^[a-z]+$/.test(word)) {
      expandedWords.push(word);
    } else {
      const split = word.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])/g);
      if (split) expandedWords.push(...split.map(w => w.toLowerCase()));
      else expandedWords.push(word);
    }
  });

  if (expandedWords.length === 0) return "";

  if (expandedWords.length === 1) {
    return capitalizeWord(expandedWords[0]);
  }

  // If the original company already contains uppercase acronym like "MI", keep it
  const originalAcronym = name.match(/\b[A-Z]{2,}\b/);
  if (originalAcronym && originalAcronym[0].length <= 4) {
    const remaining = expandedWords.filter(w => !originalAcronym[0].toLowerCase().includes(w));
    const combined = originalAcronym[0] + remaining.map(w => w[0].toUpperCase()).join("");
    return combined;
  }

  // Default behavior: return initials of all words (max 3)
  return expandedWords.slice(0, 3).map(w => w[0].toUpperCase()).join("");
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
