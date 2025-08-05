// --- RULE DEFINITIONS (Duplicated from popup.js) ---
const CUSTOM_SHORTCUTS = new Map([
    ["microsoft corporation", "MSFT"],
    ["apple inc.", "AAPL"],
    ["the coca-cola company", "Coke"],
    ["international business machines corporation", "IBM"],
    ["alphabet inc.", "GOOGL"],
    ["amazon.com inc.", "AMZN"]
]);

function cleanByFirstWord(name) { /* ... paste function from above ... */ }
function cleanByInitials(name) { /* ... paste function from above ... */ }
function cleanByAbbreviation(name) { /* ... paste function from above ... */ }
function cleanByShortcut(name) { /* ... paste function from above ... */ }

// --- Re-paste the cleaning functions here ---
function cleanByFirstWord(name) {
    let words = name.trim().split(/\s+/);
    if (words.length > 1 && words[0].toLowerCase() === 'the') {
        return words[1];
    }
    return words[0] || "";
}
function cleanByInitials(name) {
    let words = name.trim().split(/\s+/);
    if (words[0].toLowerCase() === 'the') { words.shift(); }
    if (words.length === 0) return "";
    const initials = [];
    for (const word of words) {
        if (/^[a-zA-Z]\.?$/.test(word)) { initials.push(word.charAt(0).toUpperCase()); }
        else { break; }
    }
    return initials.length > 1 ? initials.join('') : (words[0] || "");
}
function cleanByAbbreviation(name) {
    const words = name.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    return words.map(word => word.charAt(0)).join('').toUpperCase();
}
function cleanByShortcut(name) {
    const lowerCaseName = name.trim().toLowerCase();
    return CUSTOM_SHORTCUTS.get(lowerCaseName) || name.trim();
}


// --- BACKGROUND LOGIC ---

// Create the context menu when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "clean-company-name",
    title: "Clean Company Name",
    contexts: ["selection"]
  });
});

// Listener for when the context menu is clicked
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "clean-company-name" && info.selectionText) {
    const selectedText = info.selectionText;
    
    // Get the user's preferred cleaning rule from storage
    const data = await chrome.storage.local.get('selectedRule');
    const rule = data.selectedRule || 'first-word'; // Default to 'first-word'
    
    let cleanedText;
    switch (rule) {
        case 'first-word': cleanedText = cleanByFirstWord(selectedText); break;
        case 'initials-only': cleanedText = cleanByInitials(selectedText); break;
        case 'abbreviation': cleanedText = cleanByAbbreviation(selectedText); break;
        case 'custom-shortcut': cleanedText = cleanByShortcut(selectedText); break;
        default: cleanedText = selectedText;
    }

    // Copy the cleaned text to the clipboard
    // This requires the "clipboardWrite" permission in manifest.json
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        navigator.clipboard.writeText(text);
      },
      args: [cleanedText]
    });
  }
});