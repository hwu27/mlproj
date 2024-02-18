// Initialize global variables
var startId;
var endId;
var selectedInfo;

// Import the captureHighlight function from the highlight.js module
import { captureHighlight, receiveIdsArr} from './highlight.js';


const codeSection = document.getElementById("code-block");

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
const currentState = {
    hoveredElements: [], // Now tracks an array of element IDs
    lastHovered: null,
};

function updateHovering(elementsToHover) {
    // Clear previous hover states
    if (currentState.hoveredElements && currentState.hoveredElements.length > 0) {
        currentState.hoveredElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.classList.remove('hovering');
                // Assuming there's a corresponding annotation for each element
                const annotationElement = document.getElementById('annotation-' + elementId);
                if (annotationElement) {
                    annotationElement.classList.remove('hovering');
                }
            }
        });
    }

    // Update the state with the new elements to hover
    currentState.hoveredElements = elementsToHover;

    // Apply new hover states
    elementsToHover.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('hovering');
            // Assuming there's a corresponding annotation for each element
            const annotationElement = document.getElementById('annotation-' + elementId);
            if (annotationElement) {
                annotationElement.classList.add('hovering');
            }
        }
    });
}


// Assuming the codeSection covers the area containing all highlightable elements
codeSection.addEventListener("mousemove", debounce(async (event) => {
    // Determine if the mouse is currently over any of the highlighted elements
    let isOverHighlightedElement = false;
    let targetElement = event.target;

    if (targetElement.classList.contains('highlight')) {
        const highlightedArr = await receiveIdsArr(targetElement); // This should be optimized to avoid fetching repeatedly
        isOverHighlightedElement = highlightedArr.includes(targetElement.id);

        // Apply hover effect if the mouse is over an element that is part of the highlighted array
        if (isOverHighlightedElement) {
            currentState.lastHovered = targetElement.id; // Update the last hovered element ID
            updateHovering(highlightedArr); // Apply hover state based on the fetched array
        }
    }

    // If the mouse has moved and is not over any highlighted element, check before clearing the hover state
    if (!isOverHighlightedElement && currentState.lastHovered) {
        let stillWithinHighlightedArea = false;
        for (let elementId of currentState.hoveredElements) {
            const element = document.getElementById(elementId);
            if (element && element.contains(event.target)) {
                stillWithinHighlightedArea = true;
                break; // No need to remove hover state, mouse is still within a highlighted area
            }
        }

        if (!stillWithinHighlightedArea) {
            // Mouse has left all highlighted areas, clear hover state
            updateHovering([]);
            currentState.lastHovered = null;
        }
    }
}, 20), true);

// Add an event listener to the document for the 'click' event
document.addEventListener('click', function(event) {
    // Hide the context menu if the click is not on an input element or the annotate-choice
    if (event.target.tagName === 'INPUT' || event.target.id === 'annotate-choice'){
        return;
    }
    const elementToRemove = document.getElementById("input-text");
    if (elementToRemove) {
        elementToRemove.remove();
    }
    document.getElementById('contextMenu').style.display = 'none';
});

// Function to get the text selected by the user
function getSelectedText() {
    const selection = window.getSelection();

    // Check if there is any text selected
    if (selection.rangeCount === 0) {
        console.log(selection);
        console.log("No selections");
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
        !anchorSpan.id || !focusSpan.id || anchorSpan.classList.contains('highlight') || focusSpan.classList.contains('highlight')) {
        console.log("One of the spans does not have an ID or already highlighted");
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
    if (selectedInfo == null) {
        return;
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

    // Return when input-text is already open, so you cant create multiple inout boxes
    const inputElement = document.getElementById("input-text");
    if (inputElement || !selectedInfo) {
        return;
    }

    startId = selectedInfo.startId;
    endId = selectedInfo.endId;

    var input = document.createElement('INPUT');
    input.setAttribute('id', 'input-text');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Enter annotation here');

    document.getElementById('contextMenu').appendChild(input);

    input.focus(); // Auto-focus the input box

    // Event listener for pressing Enter key in the input box
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            var annotationText = document.getElementById('input-text').value;
            var selectedStartLine = document.getElementById(selectedInfo.startId).parentNode.getAttribute("data-line-number");
            var selectedEndLine = document.getElementById(selectedInfo.endId).parentNode.getAttribute("data-line-number");
            var lineArr = [];
            lineArr.push(selectedStartLine);
            lineArr.push(selectedEndLine);
            
            if (annotationText) {
                saveAnnotation(selectedInfo.startId, selectedInfo.endId, input.value, lineArr);
                document.getElementById('contextMenu').removeChild(input);
            }
            document.getElementById('contextMenu').style.display = 'none';
            captureHighlight(startId, endId); // Highlight the selected text
        }
        
    });
}
window.addAnnotation = addAnnotation;

// Function to save annotations
function saveAnnotation(startId, endId, text, lineRange) {
    // Send a POST request to the server with the annotation details
    fetch('/save_annotation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startId: startId, endId: endId, text: text , lineRange: lineRange})
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // Create the new annotation div
            var newDiv = document.createElement('div');
            newDiv.setAttribute('id', 'annotation-' + startId);
            newDiv.classList.add('annotationLine', 'collapsed');
            newDiv.textContent = text;

            // Get the annotations container and set it to a grid if not already
            var annotationsDiv = document.getElementById('annotations-div');
            // Use grid row start and end based on the line range
            newDiv.style.gridColumnStart = 1; // Assuming annotations take full width of the column
            newDiv.style.gridRowStart = parseInt(lineRange[0]) + 2 + "";
            newDiv.style.gridRowEnd = parseInt(lineRange[1]) + 3 + ""; // Plus one because grid lines are end-exclusive

            // Append the new annotation to the annotations container
            annotationsDiv.appendChild(newDiv);
        } else {
            console.error('Failed to save annotation.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    var annotationsDiv = document.getElementById('annotations-div');
    var marginSub = document.createElement('div');
    marginSub.classList.add('annotationLine', 'collapsed');
    marginSub.textContent = "placeholder for margin1";
    var marginSub2 = document.createElement('div');
    marginSub2.classList.add('annotationLine', 'collapsed');
    marginSub2.textContent = "placeholder for margin2";
    annotationsDiv.appendChild(marginSub);
    annotationsDiv.appendChild(marginSub2);
});

// Load annotations on document load
document.addEventListener('DOMContentLoaded', () => {
    fetch('/load_annotations')
        .then(response => response.json())
        .then(annotations => {
            annotations.forEach(annotation => {
               // Create the new annotation div
                var newDiv = document.createElement('div');
                newDiv.setAttribute('id', 'annotation-' + annotation.startId);
                newDiv.classList.add('annotationLine', 'collapsed');
                newDiv.textContent = annotation.text;
                
                // Get the annotations container and set it to a grid if not already
                var annotationsDiv = document.getElementById('annotations-div');
                
                // Use grid row start and end based on the line range
                newDiv.style.gridColumnStart = 1; // Assuming annotations take full width of the column
                newDiv.style.gridRowStart = parseInt(lineRange[0]) + 2 + "";
                newDiv.style.gridRowEnd = parseInt(lineRange[1]) + 3 + ""; // Plus one because grid lines are end-exclusive

                // Append the new annotation to the annotations container
                annotationsDiv.appendChild(newDiv);
                });
        })
        .catch(error => console.error('Error loading annotations:', error));
});
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! FIGURE OUT THE WHOLE THING ABOUT ABSOLUTE VS RELATIVE FOR newDIV.style.position!!!!!!!!!!!!!!!!!!!!