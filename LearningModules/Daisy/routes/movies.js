var express = require("express");
var router = express.Router();
var Movie = require("../models/movies");




//INDEX show all movies
router.get("/", function(req, res){
    // Get all campgrounds from DB
    
    Movie.find({}, function(err, allMovies){
       if(err){
           console.log(err);
       } else {
          res.render("movies/index.ejs",{movies:allMovies});
       }
    });
});

//CREATE add new movies to DB
router.post("/movies", function(req, res){
    console.log(req);
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



//add new movies
router.get("/new",isLoggedIn, function(req, res){
   res.render("movies/new.ejs"); 
});


// SHOW - shows more info about one movie
router.get("/:id", function(req, res){
    //find the movie with provided ID
    Movie.findById(req.params.id).populate("comments").exec( function(err, foundMovies){
        if(err){
            console.log(err);
        } else {
            console.log(foundMovies);
            //render show template with that movie
            res.render("movies/show", {movie: foundMovies});
        }
    });
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;