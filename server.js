const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const middleware = require("./middleware.js");

var todos = [
	{
		id: 1,
		description: "Water your plants!",
		done: false
	},
	{
		id: 2,
		description: "Go pet your Animal",
		done: false
	},
	{
		id: 3,
		description: "Do something for your Thesis!",
		done: false	
	}
]

app.use(middleware.logger);

app.get("/",function(req,res){
	res.send("We listen!");
});

app.get("/todo",function(req,res){
	res.json(todos);
})


app.use(express.static(__dirname+"/public"));

app.listen(PORT,function () {
	console.log("Server listens on Port: " + PORT);
});