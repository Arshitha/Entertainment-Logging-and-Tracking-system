//required imports
var express = require("express");
var app = express();
var request = require("request");

app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("search");
    
});

app.get("/results", function(req, res){
    var query = req.query.keyword;
    
    console.log(req.query);
    var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + query;
    
    request(url,function(error, response, body){
        if(!error && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            // res.render("results", {data: parsedData});
            new 
            parsedData["Search"].forEach(function(movie){ 
                var movieID = parsedData.Search.imdbID;
                var urlOne = "http://api.themoviedb.org/3/movie/" + movieID + "videos?api_key=fc2ec17d17b2ffeee2d9053a7ac02965";
                request(urlOne, function(err, res, bod){
                    if(!err && res.statusCode == 200){
                        var parsedDataOne = JSON.parse(bod);
                        res.render("results", {data: parsedData}, {dataOne: parsedDataOne});
                    }
                    
                });
                
            });
            
        }
    })
    
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Movie app has started")
});