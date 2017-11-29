var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");



var recs={Title:[],Poster:[]};
router.get("/",function(req,res){
    Movie.find({author:{id:req.user._id,username:req.user.username}},function(err,movies){
        if(err){
            console.log("Error");}
        else{
            recs.Title=[];
            recs.Poster=[];
            movies.forEach(function(movie){
            var id;
            var url1="https://api.themoviedb.org/3/search/movie?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&query=";
            var url2="&page=1&include_adult=false";
            request(url1+movie["name"]+url2,function(err,response,body) {
            if(!err && response.statusCode==200){
            var titles=JSON.parse(body);
            id=titles["results"][0]["id"];
            request("https://api.themoviedb.org/3/movie/"+id+"/recommendations?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&page=1",function(err,response,body){
            if(!err && response.statusCode==200){
            var recmovies=JSON.parse(body);
            recs.Title.push(recmovies["results"][0]["title"]);
            recs.Title.push(recmovies["results"][1]["title"]);
            recs.Title.push(recmovies["results"][2]["title"]);
            recs.Poster.push(recmovies["results"][0]["poster_path"]);
            recs.Poster.push(recmovies["results"][1]["poster_path"]);
            recs.Poster.push(recmovies["results"][2]["poster_path"]);
                    }
                });  
            }
            })
        })
        }
    })
     console.log(recs.Title.length);
     res.render("rec/rec.ejs",{recs:recs});
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
