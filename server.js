const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const middleware = require("./middleware.js");
const bodyParser = require("body-parser");



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

app.use(bodyParser.json());
app.use(middleware.logger);





/*
app.get("/",function(req,res){
	res.send("We listen!");
});
*/


//Auflistung aller ToDo Elemente
app.get("/todo",function(req,res){
	res.json(todos);
});



//Ausgabe eines bestimmten ToDo Elementes
app.get("/todo/:id",function(req,res){
	var gId = parseInt(req.params.id,10);
	var found;

	todos.forEach(function(element){
		if(gId === element.id){
			found = element;
		}
	});

	if(found){
		res.json(found);
	}else{
		res.status(404).send();
	}
	
});

app.post("/todo/add", function(req,res){
	
	/*
	var a = req.body;
	console.log(a);
	console.log(a.id);
	console.log(a.description);
	res.send(req.body);
	*/
	addToArray(req.body);


	function addToArray(element){
		if(element.description == ""  || typeof element.description == "undefined"){
			res.send("No Element was Provided!")
		}else{

			var newObject = {
				element: todos.length,
				description: element.description,
				done: false
			};
			todos.push(newObject);
			res.send("Done");
		}
	}
});




app.use(express.static(__dirname+"/public"));

app.listen(PORT,function () {
	console.log("Server listens on Port: " + PORT);
});