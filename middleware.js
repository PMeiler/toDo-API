module.exports= {
	requestHandler: function(req,res,next){
			console.log("You have taken a private route!");
			next();
		},
	logger: function(req,res,next){
		console.log("Request: "+ new Date().toString() + req.method +" "+ req.originalUrl);
		next();
	}
}