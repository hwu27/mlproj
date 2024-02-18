document.addEventListener('DOMContentLoaded', () => {
    hljs.highlightAll();  // Apply Highlight.js highlighting
    hljs.initLineNumbersOnLoad({singleLine: true});

    // Delay the execution to ensure highlight.js and line numbers are finished
    setTimeout(() => {
        const codeLines = document.querySelectorAll('#code-block tr'); // Select all lines of code
        if (!codeLines.length) {
            console.log('No code lines found. Ensure the code block ID is correct.');
            return;
        }

        let wordIndex = 0; // Initialize a word index counter

        // Iterate over each line of code
        codeLines.forEach(line => {
            const codeTd = line.querySelector('td.hljs-ln-code');
            if (!codeTd) {
                console.log('No code TD found in this line:', line);
                return;
            }

            // Convert childNodes to a static array to avoid issues with live NodeList
            const childNodes = Array.from(codeTd.childNodes);

            childNodes.forEach(child => {
                // Use try-catch block to catch any errors in processing
                try {
                    // Check if the node is a text node or a span without an ID
                    if (child.nodeType === Node.TEXT_NODE || (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN' && !child.id)) {
                        const textContent = child.textContent;
                        const segments = textContent.split(/([^a-zA-Z]+)/);

                        // Clear the existing content
                        child.textContent = '';
                        
                        segments.forEach(segment => {
                            if (segment) {
                                const span = document.createElement('span');
                                span.id = `word-${wordIndex++}`; // Assign an ID
                                span.textContent = segment;
                                if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN') {
                                    // Preserve the class of the original span
                                    span.className = child.className;
                                }
                                child.parentNode.insertBefore(span, child);
                            }
                        });
                        // Remove the original node after its content has been re-inserted as spans
                        child.parentNode.removeChild(child);
                    }
                } catch (error) {
                    console.error('Error processing child node:', child, error);
                }
            });
        });
    }, 0); // Adjust the timeout as needed
});

// Retrieve the original name from localStorage and display it.
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the original name from localStorage
    const originalName = localStorage.getItem('recentUploadOriginalName');

    // If the original name exists, set it to the text of the element
    if (originalName) {
        document.getElementById('file-name').innerText = originalName;

        // Clear the original name from localStorage since it's no longer needed
        localStorage.removeItem('recentUploadOriginalName');
    }
});

/* This is for the case where you want to assign special characters some type of class (might need it later)
if (/^[a-zA-Z]+$/.test(segment)) {
    span.className = 'word'; // Class for words
} else {
    span.className = 'special-character'; // Class for non-letter characters
}*/