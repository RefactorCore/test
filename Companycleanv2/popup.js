// --- RULE DEFINITIONS (Shared with background.js) ---
const CUSTOM_SHORTCUTS = new Map([
    ["microsoft corporation", "MSFT"],
    ["apple inc.", "AAPL"],
    ["the coca-cola company", "Coke"],
    ["international business machines corporation", "IBM"],
    ["alphabet inc.", "GOOGL"],
    ["amazon.com inc.", "AMZN"]
]);

function cleanByFirstWord(name) { /* ... same as before ... */ }
function cleanByInitials(name) { /* ... same as before ... */ }
function cleanByAbbreviation(name) { /* ... same as before ... */ }
function cleanByShortcut(name) { /* ... same as before ... */ }

// --- Re-paste the cleaning functions here for completeness ---
function cleanByFirstWord(name) {
    let words = name.trim().split(/\s+/);
    if (words.length > 1 && words[0].toLowerCase() === 'the') {
        return words[1];
    }
    return words[0] || "";
}

function cleanByInitials(name) {
    let words = name.trim().split(/\s+/);
    if (words[0].toLowerCase() === 'the') {
        words.shift();
    }
    if (words.length === 0) return "";
    const initials = [];
    for (const word of words) {
        if (/^[a-zA-Z]\.?$/.test(word)) {
            initials.push(word.charAt(0).toUpperCase());
        } else {
            break;
        }
    }
    return initials.length > 1 ? initials.join('') : (words[0] || "");
}

function cleanByAbbreviation(name) {
    const words = name.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    return words.map(word => word.charAt(0)).join('').toUpperCase();
}

function cleanByShortcut(name) {
  const words = name.trim().split(/\s+/);
  let shortcut = '';

  for (const word of words) {
    if (word.length >= 4) {
      shortcut += word.substring(0, 4);
    } else {
      shortcut += word;
    }
  }

  return shortcut.toLowerCase();
}


// --- POPUP LOGIC ---
document.addEventListener('DOMContentLoaded', async () => {
    const companyInput = document.getElementById('companyInput');
    const resultDiv = document.getElementById('resultDiv');
    const copyButton = document.getElementById('copyButton');
    const ruleSelector = document.getElementById('ruleSelector');

    // Load saved rule preference
    const data = await chrome.storage.local.get('selectedRule');
    const savedRule = data.selectedRule || 'first-word';
    document.querySelector(`input[name="rule"][value="${savedRule}"]`).checked = true;

    function processCleaning() {
        const selectedRule = document.querySelector('input[name="rule"]:checked').value;
        const namesArray = companyInput.value.split('\n').map(name => name.trim()).filter(Boolean);

        const cleanedNamesArray = namesArray.map(name => {
            switch (selectedRule) {
                case 'first-word': return cleanByFirstWord(name);
                case 'initials-only': return cleanByInitials(name);
                case 'abbreviation': return cleanByAbbreviation(name);
                case 'custom-shortcut': return cleanByShortcut(name);
                default: return name;
            }
        });
        resultDiv.textContent = cleanedNamesArray.join('\n');
    }

    // Save rule preference and re-process when changed
    ruleSelector.addEventListener('change', async (event) => {
        const selectedRule = event.target.value;
        await chrome.storage.local.set({ selectedRule });
        processCleaning();
    });

    companyInput.addEventListener('input', processCleaning);

    copyButton.addEventListener('click', () => { /* ... copy logic ... */ });

    // Copy logic
    copyButton.addEventListener('click', () => {
        if (!resultDiv.textContent) return;
        navigator.clipboard.writeText(resultDiv.textContent).then(() => {
            const originalButtonText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = originalButtonText; }, 1500);
        }).catch(err => console.error('Failed to copy text: ', err));
    });

    // Initial processing
    processCleaning();
});