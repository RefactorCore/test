document.addEventListener('DOMContentLoaded', function() {
    const companyInput = document.getElementById('companyInput');
    const resultDiv = document.getElementById('result');
    const copyButton = document.getElementById('copyButton');

    // Function to clean a single company name based on the rules
    function cleanSingleCompanyName(companyName) {
        if (!companyName || companyName.trim() === '') {
            return ''; // Handle empty or only whitespace input for a single line
        }

        let words = companyName.trim().split(/\s+/); // Split by one or more spaces

        if (words.length === 0) {
            return ''; // Should not happen with trim(), but for safety
        }

        // Rule: Remove "The" word if it's the first word.
        if (words[0].toLowerCase() === 'the') {
            words.shift(); // Remove "The" from the array
            if (words.length === 0) {
                return ''; // If only "The" was entered, return empty string.
            }
        }

        // Rule: If the company name is like "A W Company" or "A W C Company",
        // combine the initial single letters into a single string (e.g., "AW", "AWC").
        // Otherwise, return only the first word.
        const initials = [];
        let nonInitialWordFound = false;

        for (let i = 0; i < words.length; i++) {
            // Check if the word is a single letter (case-insensitive) followed by a dot or just a single letter
            // Also consider if it's a single letter with no dot but followed by another single letter, e.g., "A B C"
            if (words[i].length === 1 && /[a-zA-Z]/.test(words[i])) {
                initials.push(words[i].toUpperCase()); // Convert to uppercase for consistency
            } else if (words[i].length === 2 && /[a-zA-Z]\./.test(words[i])) { // e.g., "A."
                initials.push(words[i].charAt(0).toUpperCase());
            }
            else {
                nonInitialWordFound = true;
                break; // Stop if we encounter a non-initial word
            }
        }

        if (initials.length > 0 && !nonInitialWordFound) {
             return initials.join(''); // Combine all found initials
        } else if (initials.length > 0 && nonInitialWordFound && words.length > initials.length) {
            // If there are initials followed by other words (e.g., A W Company), return combined initials
            // This part handles cases like "A W Company" -> "AW"
            return initials.join('');
        }
        else {
            // Original logic: just return the first word if no special initial pattern or 'The'
            return words[0];
        }
    }

    // Event listener for input changes in the textarea
    companyInput.addEventListener('input', function() {
        const inputNames = companyInput.value;
        // Split the input by new lines, process each line, and filter out empty lines
        const namesArray = inputNames.split('\n').map(name => name.trim()).filter(name => name !== '');

        // Clean each name and store the results
        const cleanedNamesArray = namesArray.map(name => cleanSingleCompanyName(name));

        // Display the results, joined by new lines
        resultDiv.textContent = cleanedNamesArray.join('\n');
    });

    // Event listener for the Copy button
    copyButton.addEventListener('click', function() {
        const textToCopy = resultDiv.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Optional: Provide visual feedback to the user
            const originalButtonText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalButtonText;
            }, 1500); // Change back after 1.5 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please copy manually.');
        });
    });
});