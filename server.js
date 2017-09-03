var express = require("express");
var bodyParser = require("body-parser");
var engines = require("consolidate");
var passport = require("passport");
var session  = require("express-session");
var mongoose = require("mongoose");
var route   = require("./app/routes/route.js");
var path     = process.cwd();
var app = express();

require("dotenv").load();
require("./app/config/passport.js")(passport);


app.engine("html", engines.nunjucks);
app.set("view engine", "html");
app.set("views", "./public/views");
app.use("/public", express.static(path+"/public"));
app.use("/controller",express.static(path+"/app/controller"))
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI);

app.use(session({
	secret: 'please',
	resave: false,
	saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

route(app,passport);


var port = 8080;
app.listen(port,()=>{
	console.log("App is listening on port %s.",port);
});