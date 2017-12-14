var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");



//renders the search form 
router.get("/", function(req, res){
    res.render("search/search.ejs");
    
});

//responds to request sent from search.ejs by rendering the results.ejs page
router.get("/results", function(req, res){
    var query = req.query.keyword;
    console.log(query)
    var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + query;
    request(url,function(error, response, body){
        if(!error && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            if (parsedData["Search"]){
                res.render("search/results.ejs", {data: parsedData});
            }
            else{
                res.send("Data unavailable")
            }
        }
    })
});




function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;