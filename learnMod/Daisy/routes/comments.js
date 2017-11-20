var express = require("express");
var router = express.Router({mergeParams: true});
var Movie = require("../models/movies");
var Comment = require("../models/comments");




// ====================
// COMMENTS ROUTES
// ====================

router.get("/new",isLoggedIn, function(req, res){
    // find movie by id
    Movie.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {movie: movie});
        }
    })
});

router.post("/",isLoggedIn, function(req, res){
   //lookup movie using ID
   Movie.findById(req.params.id, function(err, movie){
       if(err){
           console.log(err);
           res.redirect("/movies");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
           comment.author.id = req.user._id;
           comment.author.username = req.user.username;
          // console.log("New comments' username will be" + req.user._id);
           //save comment
           comment.save();
               movie.comments.push(comment);
               movie.save();
               res.redirect('/movies/' + movie._id);
           }
        });
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