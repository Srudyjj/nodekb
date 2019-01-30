const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb', { useNewUrlParser: true });
let db = mongoose.connection;

db.once('open', () => {
    console.log("Connected to MongoDB")
})

db.on('error', (err) => {
    console.log(err);
})

// init App
const app = express();

let Article = require('./models/article');


// Load View Engine

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Home route
app.get('/', (req, res) => {
    
    Article.find({}, (err, articles) => { 
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    })
});

// Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
 
    article.save( err => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
});

app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article
        });
        
        return;
    })    
})

app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('edit_article', {
            title: 'Edit Article',
            article
        });
        
        return;
    })    
})

app.post('/articles/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id} 
 
    Article.update(query, article, err => {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/')
        }
    })
});

app.delete('/article/:id', (req, res) => {
    let query = {_id:req.params.id};
    Article.remove(query, (err)=>{
        if (err) {
            console.log(err);
        } 
        res.send('Success')
    })

})

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000...")
})