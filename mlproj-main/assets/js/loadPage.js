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
                    if (child.nodeType === Node.TEXT_NODE) {
                        const span = document.createElement('span');
                        span.id = `word-${wordIndex++}`;
                        span.textContent = child.textContent;
                        child.parentNode.replaceChild(span, child);
                    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN') {
                        if (!child.id) {
                            var textContent = child.textContent;
                            var words = textContent.split(/\s+/);
                            if (words.length == 1) {
                                child.id = `word-${wordIndex++}`;
                            } else {
                                child.textContent = ''; // Clear the existing content
                                words.forEach(word => {
                                    if (word.length > 0) {
                                        const wordSpan = document.createElement('span');
                                        wordSpan.id = `word-${wordIndex++}`;
                                        wordSpan.textContent = word + ' ';
                                        child.appendChild(wordSpan);
                                    }
                                });
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error processing child node:', child, error);
                }
            });
        });
    }, 0); // Adjust the timeout as needed
});
