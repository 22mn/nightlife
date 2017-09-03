"use strict";
var yelp = require("yelp-fusion");
var path = process.cwd();
var pureList= require(path+"/app/controller/yelp-query.server.js");
var Shop = require(path+"/app/models/shop.js");


module.exports = function(app,passport){
	
	var limit=50, location="california",skip=0;
	
	function yelpResult(req,res,next){
		var searchRequest = {
			term : 'bars',
			location : location,
			limit : limit,
			sort_by: "rating",
			skip : skip
		}
		yelp.accessToken(process.env.YELP_ID,process.env.YELP_SECRET).then(function(response){
			var client = yelp.client(response.jsonBody.access_token);
			client.search(searchRequest).then(function(response){
				var result = response.jsonBody.businesses;
				req.body.result = result;
				next();
			})
		}).catch(function(err){
			console.log(err);
		});

	}

	function isLoggedIn(req, res, next){       
		if (req.isAuthenticated()){                 
			return next();
		}else{
			res.redirect("/");
		}
	}


	app.route("/")
			.get(function(req,res){
				res.render("home");
			})
			.post(function(req,res){
				location = req.body.city;
				res.redirect("/"+req.body.city);
			});

	app.route("/:city")
			.get(yelpResult,function(req,res){
				var data = pureList(req.body.result);   // yelp-result modified	
				data.forEach(function(item){
					Shop.findOne({id:item[8]},function(err,ok){
						if (err) {console.log(err)}
						if (!ok){
							var model = new Shop();
							model.id = item[8];
							model.book = [];
							model.save(function(err){
								if (err) {console.log(err)}
							}) 
						}
					})
				})
		
				res.render("city",{obj:data});      // render city-template				 
			})

	app.route("/user/going")
			.post(isLoggedIn,function(req,res){
				var find = {"id":req.body.id,"book":req.user.twitter.id};
				var update = {$pull:{"book":req.user.twitter.id}}
				Shop.findOneAndUpdate(find,update,{"new":true},function(err,ok){					
					if (err) {console.log(err)}
					if (ok) {
						return res.json({"count":ok.book.length});
					}
					find = {"id":req.body.id};
					update = {$push:{"book":req.user.twitter.id}}
					Shop.findOneAndUpdate(find,update,{"new":true},function(err,okk){
						if (err) {console.log(err)}
						return res.json({"count":okk.book.length});
					})

				})
				
			})

	app.route('/auth/twitter')         // authentication window
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback') // authentication result
		.get(passport.authenticate('twitter', {
			failureRedirect: '/auth/twitter'
		}),function(req,res){ res.redirect("/"+location)});
}