var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose    = require("mongoose");
var request =require("request");

mongoose.connect("mongodb://localhost/VeoShare_movies");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// SCHEMA SETUP
var movieSchema = new mongoose.Schema({
   name: String,
   image: String,
  link: String
});

var Movie = mongoose.model("Movie", movieSchema);

// movie.create(
//      {
//         name:"Der Vagabund und das Kind (1921)", 
//          image: "https://images-na.ssl-images-amazon.com/images/M/MV5BZjhhMThhNDItNTY2MC00MmU1LTliNDEtNDdhZjdlNTY5ZDQ1XkEyXkFqcGdeQXVyNjc1NTYyMjg@._V1_UX182_CR0,0,182,268_AL_.jpg",
//          link: "http://www.imdb.com/title/tt0012349/"
         
//      },
//      function(err, movie){
//          if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED MOVIE: ");
//           console.log(movie);
//       }
//      });

    
app.get("/", function(req, res){
    res.render("homepage");
});

//INDEX show all movies
app.get("/movies", function(req, res){
    // Get all campgrounds from DB
    Movie.find({}, function(err, allMovies){
       if(err){
           console.log(err);
       } else {
          res.render("index.ejs",{movies:allMovies});
       }
    });
});

app.get("/search", function(req, res){
   res.render("search.ejs");
});

//search movies
app.get("/search/results", function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s="+ query +"&apikey=thewdb";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            res.render("results.ejs", {data: data});
        }
    });
});

//CREATE add new movies to DB
app.post("/movies", function(req, res){
    // get data from form and add to movies array
    var name = req.body.name;
    var image = req.body.image;
    var link=req.body.link;
    var newmovie = {name: name, image: image,link: link}
    // Create a new campground and save to DB
    Movie.create(newmovie, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to movies page
            res.redirect("/movies");
        }
    });
   
});

app.get("/movies/new", function(req, res){
   res.render("new.ejs"); 
});


// SHOW - shows more info about one movie
app.get("/movies/:id", function(req, res){
    //find the movie with provided ID
    Movie.findById(req.params.id, function(err, foundMovies){
        if(err){
            console.log(err);
        } else {
            //render show template with that movie
            res.render("show", {movie: foundMovies});
        }
    });
})
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The VeoShare Server Has Started!");
});