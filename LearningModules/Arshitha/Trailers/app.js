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
    console.log(query)
    
    var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + query;
    
    request(url,function(error, response, body){
        if(!error && response.statusCode == 200){
            var parsedData = JSON.parse(body);
            if (parsedData["Search"]){
                res.render("results", {data: parsedData});
            }
            else{
                res.send("Data unavailable")
            }
        }
    })
});

app.get("/info",function(req, res){
    var query = req.query.movieID;
    var addData
    

    var urlOne = "http://www.omdbapi.com/?apikey=thewdb&i=" + query;
            
    request(urlOne, function(err, res, bod){
        if(!err && res.statusCode == 200){
            var parsedDataOne = JSON.parse(bod);
        
         addData = {Title: parsedDataOne.Title, Released: parsedDataOne.Released, Year: parsedDataOne.Year, Plot: parsedDataOne.Plot, Actors: parsedDataOne.Actors, Ratings: parsedDataOne.Ratings }
            
        }
         
        
    } );
    
    //console.log(addData)
    //var moviePlot = req.query.moviePlot;
    //console.log(req.query)
    var url = "http://api.themoviedb.org/3/movie/" + query + "/videos?api_key=fc2ec17d17b2ffeee2d9053a7ac02965&append_to_response=videos";
    //console.log(url)
    
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            
            var parsedData = JSON.parse(body);
            //console.log(parsedData)
            if (parsedData["results"]){
                res.render("info", {data: parsedData, query: addData});
                console.log({data: parsedData, query: addData})
            }
            else{
                res.send("Trailer unavailable")
            }
            
        }
    })
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Movie app has started")
});