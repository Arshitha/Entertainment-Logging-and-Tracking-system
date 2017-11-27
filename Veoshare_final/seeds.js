var mongoose =require("mongoose");
var Movie = require("./models/movies");
var Comment = require("./models/comments");
var data = [
      {
        name:"Der Vagabund und das Kind (1921)", 
         image: "https://images-na.ssl-images-amazon.com/images/M/MV5BZjhhMThhNDItNTY2MC00MmU1LTliNDEtNDdhZjdlNTY5ZDQ1XkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX182_CR0,0,182,268_AL_.jpg",
         link: "http://www.imdb.com/title/tt0012349/"
         
      }
    ]
function seedDB() {
    Movie.remove({},function(err){
    if(err) {
         console.log(err);
    }
    console.log("Remove Movies!");
     //add a few campgrounds
        data.forEach(function(seed){
            Movie.create(seed, function(err, movie){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a movie");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                movie.comments.push(comment);
                                movie.save();
                                console.log("Created new comment");
                            }
                        });
                }
            })
        })
 })
}

module.exports = seedDB;