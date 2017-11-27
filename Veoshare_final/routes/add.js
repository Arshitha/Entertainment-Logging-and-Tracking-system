var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");

router.get("/",isLoggedIn, function(req, res){
   for(var key in req.query){
       var name=key.split(";")[0];
       var img=key.split(";")[1];
       
   }
   res.render("movies/addmovie.ejs",{name:name,img:img}); 
});
router.post("/", function(req, res){
    // get data from form and add to movies array
    var name = req.body.name;
    var image = req.body.image;
    var link=req.body.link;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newmovie = {name: name, image: image,link: link,author : author}
    // Create a new campground and save to DB
    Movie.create(newmovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to movies page
            console.log(newlyCreated);
            res.redirect("/movies");
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