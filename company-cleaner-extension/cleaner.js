export function cleanCompanyName(name) {
  const suffixesToRemove = [
    "group", "services", "company", "corporation", "corp", "limited", "ltd",
    "pty", "llc", "nl", "linx", "aluminium", "co", "inc", "webshop"
  ];

  // If it's a URL or email, extract the domain
  const domainMatch = name.match(/(?:https?:\/\/)?(?:www\.)?([^\/@\s]+)(?:\/|$)/i);
  if (domainMatch) {
    const domain = domainMatch[1]
      .replace(/@/, "") // from email
      .replace(/\.(com|net|org|au|us|ph|co|uk|gov|io|biz|info)$/i, "") // remove TLD
      .replace(/\..*$/, "") // remove any remaining subdomains
      .replace(/[^a-zA-Z0-9]/g, ""); // remove hyphens and special chars

    return domain.charAt(0).toUpperCase() + domain.slice(1);
  }

  let original = name.trim();
  let cleaned = original.toLowerCase();

  // Remove known suffixes
  suffixesToRemove.forEach(word => {
    cleaned = cleaned.replace(new RegExp("\\b" + word + "\\b", "gi"), "");
  });

  // Remove extra symbols and whitespace
  cleaned = cleaned.replace(/[^a-zA-Z0-9\s]/g, "").trim();

  const words = cleaned.split(/\s+/);
  const originalWords = original.trim().split(/\s+/);

  // If it's an acronym or already capitalized term
  if (/^[A-Z0-9]{2,}$/.test(originalWords[0])) {
    return originalWords[0];
  }

  if (words.length === 1) {
    return capitalizeWord(words[0]);
  }

  return words.slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
