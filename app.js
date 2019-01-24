const express = require('express');
const path = require('path');

// init App
const app = express();


// Load View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home route
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Articles'
    });
});

// Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000...")
})