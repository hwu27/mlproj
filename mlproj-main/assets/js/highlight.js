var serverStartId;
var serverEndId;

// Need to add a thing where you could save the highlights !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// There may be logical errors in the code
window.onload = function() {
    loadHighlightsFromServer();
}

function saveHighlight(startId, endId) {
    serverStartId = startId;
    serverEndId = endId;
}

function restoreHighlights(savedHighlights) {
    savedHighlights.forEach(({ startId, endId }) => {
        applyHighlightBetween(startId, endId);
    });
}

export function captureHighlight(startId, endId) {
    serverStartId = startId;
    serverEndId = endId;
    if (startId && endId && startId !== 'code-block' && endId !== 'code-block') {
        console.log('check save highlight');
        applyHighlightBetween(startId, endId)
        saveHighlight(startId, endId);
        saveHighlightsToServer();
    }
}

function applyHighlightBetween(startId, endId) {
    let highlighting = false;
    document.querySelectorAll('#code-block span').forEach(span => {
        if (span.id === startId) {
            highlighting = true;
        }

        if (highlighting) {
            span.classList.add('highlight');
        }

        if (span.id === endId) {
            highlighting = false;
        }
    });
}

function saveHighlightsToServer() { 
    // Only proceed if serializedHighlights is a non-empty string
    fetch('/save_highlights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startId: serverStartId, endId: serverEndId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Highlights saved', data);
    })
    .catch(error => {
        console.error('Error saving highlights', error);
    });
}

// load highlights
function loadHighlightsFromServer() {
    fetch('/load_highlights')
    .then(response => response.json())
    .then(data => {
        if (data) {
            console.log("Data received:", data);
            restoreHighlights(data);
        }
    })
    .catch(error => {
        console.error('Error loading highlights', error);
    });
}
