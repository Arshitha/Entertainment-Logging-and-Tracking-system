var express = require("express"),
mongoose=require("mongoose"),
bodyParser=require("body-parser"),
app=express();

mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var eventSchema = new mongoose.Schema({
    title: String,
    time:String
});

var Event= mongoose.model("event",eventSchema);
app.get("/",function(req,res){
    res.redirect("/events");
    
});

app.get("/events",function(req,res){
    Event.find({},function(err,events){
        if(err){
            console.log("ERROR")
        }else{
            res.render("index",{events:events});
        }
    });
    
});
app.post("/events",function(req,res){
    Event.create(req.body.event,function(err,newEvent){
        if(err){
            console.log("error");
        }else{
            res.redirect("/events");
        }
    });
});

app.listen( process.env.PORT , process.env.IP ,function(){
    console.log("hi");
})