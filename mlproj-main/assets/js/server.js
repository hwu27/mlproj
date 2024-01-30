const express = require('express');
const multer = require('multer'); 
const app = express();
const path = require('path');
// Manage uploads
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
// For database access through mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://huw029:123w123u@mlproj.cg6drd2.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const annotationSchema = new mongoose.Schema({
    startId: String,
    endId: String,
    text: String
});

const Annotation = mongoose.model('Annotation', annotationSchema);

const highlightSchema = new mongoose.Schema({
    startId: String,
    endId: String
});

const Highlight = mongoose.model('Highlight', highlightSchema);


// Serve static files from the 'mlproj' directory
app.use(express.static(path.join(__dirname, '..', '..','..', 'mlproj')));

app.use(express.json());

// Allows for rendering  a new page
app.set('view engine', 'ejs');

app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    
    // Process the file here and create a new page in your application
    // ...

    // For demonstration, let's say the new page's URL is /view/{fileId}
    const newPageUrl = `/view/${file.filename}`; 
    
    res.json({ success: true, newPageUrl: newPageUrl });
});

app.get('/view/:fileId', (req, res) => {
    const fileId = req.params.fileId;
    const filePath = path.join(__dirname, 'uploads', fileId);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            // Handle errors (file not found, etc.)
            return res.status(404).send('File not found');
        }

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

app.post('/save_annotation', async (req, res) => {
    const { lineId, text } = req.body;

    try {
        const newAnnotation = new Annotation({ lineId, text });
        await newAnnotation.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/load_annotations', async (req, res) => {
    try {
        const annotations = await Annotation.find({});
        res.json(annotations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/save_highlights', async (req, res) => {
    const { startId, endId } = req.body; 

    try {
        // Create a new instance of the Highlight model
        const newHighlight = new Highlight({ startId, endId });
        // Save the new Highlight instance to the database
        await newHighlight.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/load_highlights', async (req, res) => {
    try {
        console.log("Loaded Highlights");
        const highlights = await Highlight.find({});
        res.json(highlights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const server = app.listen(3000, () => {
    console.log('Server started on port 3000');
});

