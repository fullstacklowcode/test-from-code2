require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection options
const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};


// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, mongoOptions)
    .then(() => {
        console.log('Connected to MongoDB');
        // Once connected, start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Read all files in the functions directory
const functionFiles = fs.readdirSync('./functions');

// Dynamically import and route each function file
functionFiles.forEach((file) => {
    const { route, handler } = require(`./functions/${file}`);
    app.get(route, async (req, res) => {
        try {
            // Get the database object
            const db = mongoose.connection.db;
            // Call the handler function passing the database object
            await handler(req, res, db);
        } catch (error) {
            console.error('Error handling request:', error);
            res.status(500).send('Internal Server Error');
        }
    });
});
