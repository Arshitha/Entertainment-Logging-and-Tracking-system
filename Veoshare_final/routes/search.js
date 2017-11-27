var request =require("request");
var express = require("express");
var router = express.Router();
// var Movie = require("../models/movie");



//search movies
router.get("/",isLoggedIn, function(req, res){
    
   res.render("search/search.ejs");
});

//search movies
router.get("/results",isLoggedIn, function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s="+ query +"&apikey=thewdb";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            res.render("search/results.ejs", {data: data});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;