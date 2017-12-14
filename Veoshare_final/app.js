var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose    = require("mongoose");
var flash       = require("connect-flash");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var methodOverride = require("method-override");
var request =require("request");
var Movie = require("./models/movies");
var seedDB = require("./seeds");
var Comment = require("./models/comments");
var User = require("./models/users");

//requiring routes
var commentRoutes = require("./routes/comments");
var movieRoutes = require("./routes/movies");
var authRoutes = require("./routes/index");
var searchRoutes = require("./routes/search");
var popularRoutes = require("./routes/popular");
var topRoutes = require("./routes/toprated");
var recRoutes = require("./routes/rec");
var addRoutes = require("./routes/add");
var infoRoutes = require("./routes/info");

//seedDB();
var url = process.env.DATABASEURL || "mongodb://localhost/VeoShare_movie"
console.log(process.env.DATABASEURL);
//process.env.databaseURL
mongoose.connect(url);
//mongoose.connect("mongodb://localhost/VeoShare_movies");
//mongoose.connect("mongodb://123:123@ds119486.mlab.com:19486/veo");



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Welcome！",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/movies/:id/comments",commentRoutes);
app.use("/movies",movieRoutes);
app.use("/addmovie",addRoutes);
app.use("/search",searchRoutes);
app.use("/popular",popularRoutes);
app.use("/toprated",topRoutes);
app.use("/rec",recRoutes);
app.use("/info",infoRoutes);
app.use("/",authRoutes);

// SCHEMA SETUP

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The VeoShare Server Has Started!");
});

