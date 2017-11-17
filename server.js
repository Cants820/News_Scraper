
//set all dependecies and packages being used
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var db = require("./models");
var axios= require("axios");
var cheerio =require("cheerio");
// for mongo deployement onto heroku
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrapper";
//mongo and mongoose

var app = express();//express = app
var port = process.env.PORT || 3036;

//Use morgan logger for logging requests
app.use(logger("dev"));

//Serve static content for the app from the "public " directory in the application directory.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false}));

//Set mongoose to leverage built in Javascript
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/webscrapper",{
  useMongoClient: true
})

//setup handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main"}));
app.set("view engine", "handlebars"); // the view folder is another Express.js default which can be overwritten with the view setting)


//routes 
// var routes = require("./controllers/routes.js");
// app.use("/controllers", routes);

app.get("/",function(req,res){
 
  db.Article.find({}).then(function(dbArticles) {
    if(dbArticles.length != 0) {
      //console.log("\n result: ", dbArticles);
      var article = {
        article: dbArticles
      }
      //console.log("\n handlebars ", hdlbrs);
      res.render("index", article);
      }else {
      // with response 
      // render hdlbrs index template 
      res.render("index");
    }
  })
  .catch(function(err) {
    res.json(err);
  });
})

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      // result.save = false;

      // Create a new Article using the `result` object built from scraping
      db.Article
        .create(result)
        .then(function(dbArticle) {
          
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
        });
    });
    res.send(true);
  });
});

//get all articles
app.get("/articles/saved", function(req, res){

   db.Article.find({boolean: true}).then(function(dbArticles) {
    if(dbArticles.length != 0) {
      //console.log("\n result: ", dbArticles);
      var article = {
        article: dbArticles
      }

      //console.log("\n handlebars ", hdlbrs);
      res.render("partials/save", articles);
   
      }else {
      
      // with response 
      // render hdlbrs index template 
      res.render("partials/save");
    }
  })
  .catch(function(err) {
    res.json(err);
  });


})

app.get("/articles/:id", function(req, res){

}) 

app.post("/articles/:id", function(req, res){
  var id = req.params.id;
    console.log("Hello !!!!!");
     // Create a new note and pass the req.body to the entry
    db.Article.create(req.body).then(function(dbArticle) {
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { _id: dbArticle._id }, { boolean: true });
        })
        .then(function(dbArticle) {
          res.json(dbArticle);
        })
        .catch(function(err) {
          res.json(err);
        });

});

app.listen(port, function(){
  console.log("server is online!!!");
  console.log("Welcome to Mongo Scapper");
});