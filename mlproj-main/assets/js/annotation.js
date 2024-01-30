// Initialize global variables
var startId;
var endId;
var selectedInfo;

// Import the captureHighlight function from the highlight.js module
import { captureHighlight } from './highlight.js';

// Add an event listener to the document for the 'click' event
document.addEventListener('click', function(event) {
    // Hide the context menu if the click is not on an input element or the annotate div
    if (event.target.tagName === 'INPUT' || event.target.id === 'annotate-div'){
        return;
    }
    document.getElementById('contextMenu').style.display = 'none';
});

// Function to get the text selected by the user
function getSelectedText() {
    const selection = window.getSelection();
    // Check if there is any text selected
    if (selection.rangeCount === 0) {
        console.log("No selection or selection is collapsed");
        return null;
    }
    // Determine the start and end nodes of the selection
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;

    // Find the nearest span elements enclosing the selected text
    const anchorSpan = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentNode : anchorNode;
    const focusSpan = focusNode.nodeType === Node.TEXT_NODE ? focusNode.parentNode : focusNode;

    // Check if the spans are valid and within a code block with an ID
    if (!anchorSpan || !focusSpan || !anchorSpan.closest('code') || !focusSpan.closest('code') ||
        !anchorSpan.id || !focusSpan.id) {
        console.log("One of the spans does not have an ID");
        return null;
    }

    const selectedText = selection.toString().trim();
    
    // Return an object containing the IDs of the start and end spans, the selected text, and the selection object
    return { startId: anchorSpan.id, endId: focusSpan.id, selectedText: selectedText , selected: selection };
}

// Function to display a custom context menu
function showContextMenu(event) {
    event.preventDefault(); // Prevent default browser context menu

    selectedInfo = getSelectedText();
    if (selectedInfo) {
        console.log(selectedInfo);
    }
    var contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    
    document.getElementById('selected-text').value = "Annotate";
}
window.showContextMenu = showContextMenu;

// Function to add an annotation
function addAnnotation() {
    if (!selectedInfo) return; // Return if no valid text is selected

    startId = selectedInfo.startId;
    endId = selectedInfo.endId;

    var input = document.createElement('INPUT');
    input.setAttribute('id', 'input-text');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter annotation here');

    document.getElementById('contextMenu').appendChild(input);

    // Prevent default behavior for mousedown event on input
    input.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });

    input.focus(); // Auto-focus the input box

    // Event listener for pressing Enter key in the input box
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            var annotationText = document.getElementById('input-text').value;
            if (annotationText) {
                saveAnnotation(selectedInfo.startId, selectedInfo.endId, input.value);
                document.getElementById('contextMenu').removeChild(input);
            }
            document.getElementById('contextMenu').style.display = 'none';
            captureHighlight(startId, endId); // Highlight the selected text
        }
        
    });
}
window.addAnnotation = addAnnotation;

// Function to save annotations
function saveAnnotation(startId, endId, text) {
    // Send a POST request to the server with the annotation details
    fetch('/save_annotation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startId: startId, endId: endId, text: text })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            var newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'annotation-' + startId);
            newDiv.textContent = text;
            document.getElementById('annotations-div').appendChild(newDiv);
        } else {
            console.error('Failed to save annotation.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Load annotations on document load
document.addEventListener('DOMContentLoaded', () => {
    fetch('/load_annotations')
        .then(response => response.json())
        .then(annotations => {
            annotations.forEach(annotation => {
                var newDiv = document.createElement('div');
                newDiv.textContent = annotation.text;
                document.getElementById('annotations-div').appendChild(newDiv);
            });
        })
        .catch(error => console.error('Error loading annotations:', error));
});
