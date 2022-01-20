//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


//////////////// ----------Request Trageting all the Articles--------------- //////////////

app.route("/articles")
    
.get(function (req, res) {
    Article.find(function (err, foundArticle) {
        if (err) {
            res.send(err);
        }
        else {
            res.send(foundArticle);
        }
    });
})
    
.post(function (req, res) {
    const newArticle = new Article({
        title:req.body.title,
        content: req.body.content
    });
    newArticle.save(function (err) {
        if (!err) {
            console.log("Sucessfully Saved");
        }
        else {
            console.log(err);
        }
    });
})
    
.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Deletion Success");
        }
        else {
            res.send(err);
        }
    });
});

//TODO


//////////////////-------------- Request Targeting the specific Article------------////////////////


app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No match Found");
            }
        });
    })

    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send("Added Update");
                }
            });
    })

    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Patch Added");
                }
            });
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Deleted Particular Article");
                }
            }); 
    });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});