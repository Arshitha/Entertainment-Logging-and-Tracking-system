var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");
//Displays information about each movie from the search result depending on the users selection
router.get("/",function(req, res){
    var query = req.query.movieID;
    var addData
    var urlOne = "http://www.omdbapi.com/?apikey=thewdb&i=" + query;
    request(urlOne, function(err, res, bod){
        if(!err && res.statusCode == 200){
            var parsedDataOne = JSON.parse(bod);
            addData = {Title: parsedDataOne.Title,Poster:parsedDataOne.Poster,Released: parsedDataOne.Released, Year: parsedDataOne.Year, Plot: parsedDataOne.Plot, Actors: parsedDataOne.Actors, Ratings: parsedDataOne.Ratings }
        }
    } );
    var url = "http://api.themoviedb.org/3/movie/" + query + "/videos?api_key=fc2ec17d17b2ffeee2d9053a7ac02965&append_to_response=videos";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            //console.log(parsedData)
            if (parsedData["results"]){
                console.log(addData);
                res.render("search/info.ejs", {data: parsedData, query: addData});
            }
            else{
                res.send("Trailer unavailable")
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