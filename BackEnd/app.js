var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose    = require("mongoose");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var request =require("request");
var Movie = require("./models/movies");
var seedDB = require("./seeds");
var Comment = require("./models/comments");
var User = require("./models/users");

seedDB();
mongoose.connect("mongodb://localhost/VeoShare_movies");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

// SCHEMA SETUP


    
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
          res.render("movies/index.ejs",{movies:allMovies});
       }
    });
});

//search movies
app.get("/search",isLoggedIn, function(req, res){
   res.render("movies/search.ejs");
});

//search movies
app.get("/search/results",isLoggedIn, function(req, res){
    var query = req.query.search;
    var url = "http://www.omdbapi.com/?s="+ query +"&apikey=thewdb";
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            res.render("movies/results.ejs", {data: data});
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

//add new movies
app.get("/movies/new", function(req, res){
   res.render("movies/new.ejs"); 
});


// SHOW - shows more info about one movie
app.get("/movies/:id", function(req, res){
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

// ====================
// COMMENTS ROUTES
// ====================

app.get("/movies/:id/comments/new",isLoggedIn, function(req, res){
    // find movie by id
    Movie.findById(req.params.id, function(err, movie){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {movie: movie});
        }
    })
});

app.post("/movies/:id/comments",isLoggedIn, function(req, res){
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
               movie.comments.push(comment);
               movie.save();
               res.redirect('/movies/' + movie._id);
           }
        });
       }
   });

});

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register.ejs"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/movies"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/movies");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The VeoShare Server Has Started!");
});