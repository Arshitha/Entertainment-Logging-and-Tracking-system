var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");
var request=require("request");


router.get("/",function(req, res) {
 

    request("https://api.themoviedb.org/3/movie/top_rated?api_key=e09462e1b8b7fb2720e3f86f91480dc9&language=en-US&page=1",function(err,response,body){
                    if(!err && response.statusCode==200){
                        var populars=JSON.parse(body);
                        res.render("toprated/toprated.ejs",{populars:populars});
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