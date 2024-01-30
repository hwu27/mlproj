var startId;
var endId;
var selectedInfo;

import { captureHighlight } from './highlight.js';

// Hide context menu when clicking elsewhere
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.id === 'annotate-div'){
        return;
    }
    document.getElementById('contextMenu').style.display = 'none';
});


// For when you highlight the text and click
function getSelectedText() {
    const selection = window.getSelection();
    console.log(selection);
    if (selection.rangeCount === 0) {
        console.log("No selection or selection is collapsed");
        return null; // Ensure there is a selection
    }
    // Start and end nodes of the selection
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;

    //console.log("Anchor Node: ", anchorNode);
    //console.log("Focus Node: ", focusNode);

    // Find the parent span elements of the selected text
    const anchorSpan = anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentNode : anchorNode;
    const focusSpan = focusNode.nodeType === Node.TEXT_NODE ? focusNode.parentNode : focusNode;
    //console.log("Anchor Span: ", anchorSpan);
    //console.log("Focus Span: ", focusSpan);

    // Ensure the spans are within the code block and have an ID
    if (!anchorSpan || !focusSpan || !anchorSpan.closest('code') || !focusSpan.closest('code') ||
        !anchorSpan.id || !focusSpan.id) {
        console.log("One of the spans does not have an ID");
        return null;
    }
    // Selected text doesnt work
    const selectedText = selection.toString().trim();
    //console.log("Selected Text: ", selectedText);
    
    return { startId: anchorSpan.id, endId: focusSpan.id, selectedText: selectedText , selected: selection };
}

// Displays the context menu for different tools
function showContextMenu(event) {
    // Prevent the browser's context menu from appearing
    event.preventDefault();
    
    selectedInfo = getSelectedText();
    if (selectedInfo) {
        // Store the captured selection information
        console.log(selectedInfo);
    }
    // Show custom context menu
    var contextMenu = document.getElementById('contextMenu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    
    // Store selected text in a hidden input field or in a JavaScript variable
    // So it can be used when the user clicks on the context menu option
    document.getElementById('selected-text').value = "Annotate";

}
window.showContextMenu = showContextMenu;

// Add annotation logic
function addAnnotation() {

    if (!selectedInfo) return; // No valid text selected
    startId = selectedInfo.startId;
    endId = selectedInfo.endId;

    console.log("startId:" + startId);
    console.log("endId:" + endId);

    var input = document.createElement('INPUT');
    input.setAttribute('id', 'input-text');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter annotation here');

    document.getElementById('contextMenu').appendChild(input);

    input.addEventListener('mousedown', function(event) {
        event.preventDefault();
    });

    // Focus the input box so the user can immediately start typing
    input.focus();

    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            // Pass in selection
            console.log("This is the selection: " + selectedInfo.selected);
            // Get the annotation text from the input
            var annotationText = document.getElementById('input-text').value;
            if (annotationText) {
                // Implement saving the annotation, as shown previously
                saveAnnotation(selectedInfo.startId, selectedInfo.endId, input.value);
                // Remove the input and button after submitting the annotation
                document.getElementById('contextMenu').removeChild(input);
            }
            document.getElementById('contextMenu').style.display = 'none';
            captureHighlight(startId, endId);
        }
        
    });
}
window.addAnnotation = addAnnotation;

// Saves annotations 
function saveAnnotation(startId, endId, text) {
    // Use fetch or another AJAX method to send the annotation to the server
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
            // Create a new div to display the annotation
            var newDiv = document.createElement('div'); 
            newDiv.setAttribute('id', 'annotation-' + startId); // Use startId for uniqueness
            newDiv.textContent = text; // Set the text to the annotation
            document.getElementById('annotations-div').appendChild(newDiv);
        } else {
            // Handle error
            console.error('Failed to save annotation.');
        }
    })
    .catch(error => {
        console.error('Error:', error); 
    });
}

// Loads annotations
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

