document.addEventListener('DOMContentLoaded', () => {
    hljs.highlightAll();  // Apply Highlight.js highlighting

    const codeBlock = document.querySelector('#code-block');
    let wordIndex = 0; // Initialize a word index counter

    // Iterate over the child nodes of the codeBlock
    codeBlock.childNodes.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
            // For text nodes, wrap the text in a new span with an ID
            const span = document.createElement('span');
            span.id = `word-${wordIndex++}`; // Assign an ID
            span.textContent = child.textContent;
            child.parentNode.replaceChild(span, child);
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'SPAN') {
            // For Highlight.js spans, add an ID if they don't already have one
            if (!child.id) {
                child.id = `word-${wordIndex++}`; // Assign an ID
            }
        }
    });

    console.log("Highlighting and wrapping completed");
});