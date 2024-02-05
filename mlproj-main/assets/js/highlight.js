// Initialize variables to store the start and end IDs of highlights on the server
var serverStartId;
var serverEndId;
var serverHighlightedArr = [];
var retrievedHighlightData;

// Function to load highlights from the server when the window loads
window.onload = function() {
    loadHighlightsFromServer();
}

// Function to save the start and end IDs of a highlight
function saveHighlight(startId, endId) {
    serverStartId = startId;
    serverEndId = endId;
}

// Function to restore highlights using the saved highlights
function restoreHighlights(savedHighlights) {
    // Apply highlights for each saved pair of start and end IDs
    savedHighlights.forEach(({ startId, endId }) => {
        applyHighlightBetween(startId, endId);
    });
}

export function retrieveArr() {
    return retrievedHighlightData.highlightedArr;
}

// Exported function to capture and process highlights
export function captureHighlight(startId, endId) {
    // Update server IDs with the current start and end IDs
    serverStartId = startId;
    serverEndId = endId;

    // Check if the IDs are valid and not equal to 'code-block'
    if (startId && endId && startId !== 'code-block' && endId !== 'code-block') {
        //console.log('check save highlight');
        // Apply highlight and save it
        applyHighlightBetween(startId, endId)
        saveHighlight(startId, endId);
        // Save the highlights to the server
        saveHighlightsToServer();
    }
}

// Function to apply highlight between two span elements
function applyHighlightBetween(startId, endId) {
    let highlighting = false;
    // Iterate through each span element within the code block
    document.querySelectorAll('#code-block span').forEach(span => {
        if (span.id === startId) {
            highlighting = true;
        }

        if (highlighting) {
            // Add highlight class when within the range
            span.classList.add('highlight');
            serverHighlightedArr.push(span.id);
        }

        if (span.id === endId) {
            highlighting = false;
        }
    });
}

// Function to save highlights to the server
function saveHighlightsToServer() {
    // Send a POST request with the highlight data
    fetch('/save_highlights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startId: serverStartId, endId: serverEndId,  highlightedArr: serverHighlightedArr})
    })
    .then(response => response.json())
    .then(data => {
        serverHighlightedArr = [];
        console.log('Highlights saved', data);
    })
    .catch(error => {
        console.error('Error saving highlights', error);
    });
}

// Function to load highlights from the server
function loadHighlightsFromServer() {
    fetch('/load_highlights')
    .then(response => response.json())
    .then(data => {
        if (data) {
            console.log("Data received:", data);
            // Restore the highlights received from the server
            restoreHighlights(data);
        }
    })
    .catch(error => {
        console.error('Error loading highlights', error);
    });
}

