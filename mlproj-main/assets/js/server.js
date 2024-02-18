// Import necessary modules
const express = require('express');
const multer = require('multer'); 
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Configure Multer for file uploads, setting the destination folder
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB using Mongoose with the provided connection string
mongoose.connect('mongodb+srv://<your database here>', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema and model for annotations
const annotationSchema = new mongoose.Schema({
    startId: String,
    endId: String,
    text: String,
    lineRange: [String]
});
const Annotation = mongoose.model('Annotation', annotationSchema);

// Define a schema and model for highlights
const highlightSchema = new mongoose.Schema({
    startId: String,
    endId: String,
    highlightedArr: [String]
});
const Highlight = mongoose.model('Highlight', highlightSchema);

// Serve static files from a specific directory
app.use(express.static(path.join(__dirname, '..', '..', '..', 'mlproj-main')));

// Enable JSON parsing in Express
app.use(express.json());

// Set EJS as the view engine for rendering views
app.set('view engine', 'ejs');

// Route for handling file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: 'No file was uploaded.' });
    }
    // You retain the random filename for the URL
    const newPageUrl = `/view/${file.filename}`;
    // But you also send back the original file name for reference
    const originalName = file.originalname;
    res.json({ 
        success: true, 
        newPageUrl: newPageUrl, 
        originalName: originalName // Send the original name back in the response
    });
});

// Route for viewing uploaded files
app.get('/view/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(__dirname, 'uploads', fileId);

    // Read the file and render it in a view
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        // Function to escape HTML characters for security
        const escapeHtml = (unsafe) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };
        
        const text = escapeHtml(data);
        res.render('view', { data: text });
    });
});

// Route to save annotations to the database
app.post('/save_annotation', async (req, res) => {
    const { startId, endId, text, lineRange} = req.body;
    try {
        const newAnnotation = new Annotation({ startId, endId, text, lineRange});
        await newAnnotation.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to load annotations from the database
app.get('/load_annotations', async (req, res) => {
    try {
        const annotations = await Annotation.find({});
        res.json(annotations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to save highlights to the database
app.post('/save_highlights', async (req, res) => {
    const { startId, endId, highlightedArr} = req.body;
    try {
        const newHighlight = new Highlight({ startId, endId, highlightedArr});
        await newHighlight.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to load highlights from the database
app.get('/load_highlights', async (req, res) => {
    try {
        const highlights = await Highlight.find({});
        res.json(highlights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server on port 3000
const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});
