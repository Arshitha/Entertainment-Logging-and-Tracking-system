var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");


var recs={title:[],id:[],poster:[]};
router.get("/",function(req,res){
    Movie.find({author:{id:req.user._id,username:req.user.username}},function(err,movies){
        if(err){
            console.log("Error");}
        else{
            movies.forEach(function(movie){
            var id;
            var url1="https://api.themoviedb.org/3/search/movie?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&query=";
            var url2="&page=1&include_adult=false";
            request(url1+movie["name"]+url2,function(err,response,body) {
            if(!err && response.statusCode==200){
            var titles=JSON.parse(body);
            id=titles["results"][0]["id"];
            for(var i = 0; i<titles["results"][0]["genre_ids"].length; i++){
                var origenre = 0;
                origenre += titles["results"][0]["genre_ids"][i];
            };
            request("https://api.themoviedb.org/3/movie/"+id+"/recommendations?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&page=1",function(err,response,body){
            if(!err && response.statusCode==200){
                var recmovies=JSON.parse(body);
                var genre = [];
                for(var i = 0; i<recmovies["results"].length;i++){
                    var tempgenre = 0;
                    for(var j = 0; j< recmovies["results"][i]["genre_ids"].length; j++){
                        tempgenre += recmovies["results"][i]["genre_ids"][j];
                    }
                    genre.push(tempgenre - origenre);
                }
                var relscore = [];
                for(var i = 0; i< recmovies["results"].length; i++){
                    relscore.push(recmovies["results"][i]["id"]-id);
                }
            var final = [];
            var score = []
            for(var i = 0; i< recmovies["results"].length; i++){
                score.push(relscore[i]*genre[i]);
            }
            final = score;
            score.sort();
            for(var i = 0; i< 3; i++){
                
                var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + recmovies["results"][final.indexOf(score[i])]["title"];
                request(url,function(error, response, body){
                    if(!error && response.statusCode == 200){
                        var data = JSON.parse(body);
                        recs.id.push(data["Search"][0]["imdbID"]);
                        recs.title.push(data["Search"][0]["Title"]);
                        recs.poster.push(data["Search"][0]["Poster"]);
                    }
                })
            }
                }
                });  
            }
            })
        })
        }
    })
    
    res.render("rec/rec.ejs",{recs:recs});
    recs.title=[];
    recs.id=[];
    recs.poster=[];

});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;