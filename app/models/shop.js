var mongoose = require("mongoose");
var Schema   = mongoose.Schema;

var Shop  = new Schema({
	id : String,
	book : [String]
});

module.exports = mongoose.model("shop",Shop);