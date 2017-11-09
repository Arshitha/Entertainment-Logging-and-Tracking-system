var mongoose = require("mongoose");
var movieSchema = new mongoose.Schema({
   name: String,
   image: String,
   link: String,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Movie", movieSchema);
