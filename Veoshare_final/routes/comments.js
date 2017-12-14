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
  var dt = new Date();  

// Display the month, day, and year. getMonth() returns a 0-based number.  
var month = dt.getMonth()+1;  
var day = dt.getDate();  
var year = dt.getFullYear();  
            comment.time = month + "/" + day + "/" + year;
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
           //save comment
           comment.save();
               movie.comments.push(comment);
               movie.save();
               res.redirect('/movies/' + movie. _id);
           }
        });
       }
   });

});

router.delete("/:commentId", function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Movie.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Comment deleted!');
                res.redirect("/movies/" + req.params.id);
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