export function cleanCompanyName(name) {
  const suffixesToRemove = [
    "group", "services", "company", "corporation", "corp", "limited", "ltd",
    "pty", "llc", "nl", "linx", "aluminium", "co", "inc", "webshop"
  ];

  let original = name.trim();
  let cleaned = original.toLowerCase();

  // Remove known suffixes
  suffixesToRemove.forEach(word => {
    cleaned = cleaned.replace(new RegExp("\\b" + word + "\\b", "gi"), "");
  });

  // Remove extra spaces and special characters
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "").trim();

  // Split into words
  const words = cleaned.split(/\s+/);

  // Keep original for acronym detection
  const originalWords = original.trim().split(/\s+/);

  // If first word is already an acronym or mixed (like C2O, UGL)
  if (/^[A-Z0-9]{2,}$/.test(originalWords[0])) {
    return originalWords[0];
  }

  // Single word? Return capitalized
  if (words.length === 1) {
    return capitalizeWord(words[0]);
  }

  // Multiple words? Return initials of first two
  return words.slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
