var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");

var popular={title:[],id:[],poster:[]};
router.get("/",function(req, res) {
    request("https://api.themoviedb.org/3/movie/popular?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&page=1",function(err,response,body){
                    if(!err && response.statusCode==200){
                        var populars=JSON.parse(body);
                       for(var i = 0; i< 15; i++){
                var url = "http://www.omdbapi.com/?apikey=thewdb&s=" + populars["results"][i]["title"];
                request(url,function(error, response, body){
                    if(!error && response.statusCode == 200){
                        var data = JSON.parse(body);
                        popular.id.push(data["Search"][0]["imdbID"]);
                        popular.title.push(data["Search"][0]["Title"]);
                        popular.poster.push(data["Search"][0]["Poster"]);
                    }
                })
            }
    };
});
 res.render("popular/popular.ejs",{populars:popular});
 
})



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;