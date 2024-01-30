document.getElementById('file-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch('/upload', { // The URL to your server-side upload handler
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirect to the new page URL if the server indicates success
                window.location.href = data.newPageUrl;
            } else {
                // Handle the situation where the server reports a failure
                console.error('File upload failed.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}, false);

