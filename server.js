/*

// imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

db.serialize(function(){
    //create table
    db.run('CREATE TABLE Contacts (first_name TEXT, last_name TEXT, age INTEGER)');

    //insert values
    db.run('INSERT INTO Contacts VALUES ("John", "Doe", 25)');
});
db.close();

// mounts BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true }));


var quotes = [
    {
        id: 1,
        quote: "The best is yet to come",
        author: "Unknown",
        year: 2000
    },
    {
        id: 2,
        quote: "This is a quote",
        author: "First Last",
        year: 1930
    },
    {
        id: 3,
        quote: "This is another quote",
        author: "First2 Last2",
        year: 1910
    }
];

// ROUTES

app.get('/', function(req, res) {
    res.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        res.send("Return a list of quotes from the year: " + req.query.year);
      }
      else{
          res.json(quotes);
      }
});


app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM quotes WHERE year = ?', [req.query.year], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    res.send("Return quote with the ID: " + req.params.id);
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    res.json(req.body);
});

app.delete('quotes/:id', function(req, res) {
    console.log("Delete quote: " + req.params.id);
    res.send("Delete quote with ID: " + req.params.id);
})

app.listen(3000, function(){
console.log('Listening on Port 3000');
});

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

db.serialize(function(){
    //create table
    db.run('CREATE TABLE Contacts (first_name TEXT, last_name TEXT, age INTEGER)');

    //insert values
    db.run('INSERT INTO Contacts VALUES ("John", "Doe", 25)');
    db.run('INSERT INTO Contacts VALUES ("Jane", "Doe", 19)');
    db.run('INSERT INTO Contacts VALUES ("Sue", "Smith", 42)');

    //queries
    db.all('SELECT * FROM Contacts', processRows);
    db.each('SELECT * FROM Contacts', processRow);
    db.each('SELECT * FROM Contacts WHERE last_name = "Doe"', processRow);
    var firstName = 'John';
    db.get('SELECT * FROM Contacts WHERE first_name = ?', [firstName], function(err, row){
        console.log("Get John's Age:");
        if(err){
            console.log("ERROR: " + err.message);
        }
        else{
            console.log(row.age);
        }
    });
});


function processRows(err, rows){
    console.log("PROCESS ROWS");
    if(err){
        console.log("ERROR: " + err.message);
    }
    else{
        for(var i = 0; i < rows.length; i++){
            console.log(rows[i].first_name);
        }
    }
}

function processRow(err, row){
    console.log("PROCESS ROW");
     if(err){
        console.log("ERROR: " + err.message);
    }
    else{
        console.log(row.first_name);
    }
}

db.close();

*/

// imports
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('quotes.db');

//mounts BodyParser as middleware - every request passes through it
app.use(bodyParser.urlencoded({ extended: true })); 

// ROUTES

app.get('/', function(req, res) {
    res.send("Get request received at '/' ");
});

app.get('/quotes', function(req, res){
    if(req.query.year){
        db.all('SELECT * FROM quotes WHERE year = ?', [parseInt(req.query.year)], function(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                console.log("Return a list of quotes from the year: " + req.query.year);
                res.json(rows);
            }
        });
    }
    else{
        db.all('SELECT * FROM quotes', function processRows(err, rows){
            if(err){
                res.send(err.message);
            }
            else{
                for( var i = 0; i < rows.length; i++){
                    console.log(rows[i].quote);
                }
                res.json(rows);
            }
        });
    }
});

app.get('/quotes/:id', function(req, res){
    console.log("return quote with the ID: " + req.params.id);
    db.get('SELECT * FROM quotes WHERE rowid = ?', [req.params.id], function(err, row){
        if(err){
            console.log(err.message);
        }
        else{
            res.json(row);
        }
    });
});

app.post('/quotes', function(req, res){
    console.log("Insert a new quote: " + req.body.quote);
    db.run('INSERT INTO quotes VALUES (?, ?, ?)', [req.body.quote, req.body.author, req.body.year], function(err){
        if(err){
            console.log(err.message);
        }
        else{
            res.send('Inserted quote with id: ' + this.lastID);
        }
    });
});

app.listen(3000, function(){
    console.log('Listening on Port 3000');
});