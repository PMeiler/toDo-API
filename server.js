const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const middleware = require("./middleware.js");
const bodyParser = require("body-parser");
const _ = require("underscore");
const db = require("./db.js");



app.use(bodyParser.json());
app.use(middleware.logger);



//Auflistung aller ToDo Elemente
app.get("/todo",function(req,res){
	var qry = req.query;
	var where = {};

	if (qry.hasOwnProperty("done") && qry.done === "true"){	
		where.done = true;
	}else if(qry.hasOwnProperty("done") && qry.done === "false"){
		where.done = false;
	}

	
	if(qry.hasOwnProperty("q")){
		where.description = {
			$like: "%" + qry.q + "%"
		}
	}

	db.todo.findAll({where: where}).then(function(todos){
		res.send(todos);
	},function(err){res.status(500).send();});

		//var filtered = todos;

	
	
	/*
	if (qry.hasOwnProperty("done") && qry.done === "true"){	
		filtered = _.where(todos,{done:true})
	}else if(qry.hasOwnProperty("done") && qry.done === "false"){
		filtered = _.where(todos,{done:false});
	}


	if(qry.hasOwnProperty("q")){
		
		filtered = _.filter(filtered,function(tmp){
				return tmp.description.indexOf(qry.q) > -1 
				});
	}
	
	res.json(filtered);
	*/
});



//Ausgabe eines bestimmten ToDo Elementes
app.get("/todo/:id",function(req,res){
	var gId = parseInt(req.params.id,10);
//	var found = _.findWhere(todos,{id:gId});
	
	db.todo.findById(gId).then(function(todo){
		if(!!todo){
			res.json(todo);}
		else{
			res.status(404).send();
		}
	},function(err){
		res.status(500).json(err);
	});

});


//Füge ein neues Element der ToDo Liste bei!
app.post("/todo/add", function(req,res){
	var body = req.body;

	db.todo.create(body).then(function(todo){
		res.send("Success!");
	},function(error){
		res.status(400).json(error);
	});

});

//Lösche ein Element der ToDo Liste
app.delete("/todo/:id",function(req,res){
	
	var gId = parseInt(req.params.id,10);
	//var found = _.findWhere(todos,{id:gId});

	/*
	
	
	if(!found){
		res.status(404).send();	
	} else {
		todos = _.without(todos,found);
		res.json(found);
	}
	*/
});

//Updating
app.put("/todo/:id",function(req,res){
	var gId = parseInt(req.params.id,10);
	var body = _.pick(req.body,"description","done");
	validItem = {};
	
	db.todo.update(body,{
		where:{
			id:gId
		}}).then(function(todo){
			res.json(db.todo.findById(gId).toJSON);
		},function(err){res.status(400).json(err)})



	//var found = _.findWhere(todos,{id:gId});

	/*
	if(!found){
		return res.status(404).send();
	}

	if(body.hasOwnProperty("done") && _.isBoolean(body.done)){
		validItem.done = body.done;
	}else if(body.hasOwnProperty("done")){
		res.status(400).send();
	}else if(body.hasOwnProperty("description") && _.isString(body.description) && body.description.trim().length >0 ){
		validItem.description = body.description;
	}else if(body.hasOwnProperty("description")){
		res.status(400).send();
	}else{
		res.status(404).send();
	}

	_.extend(found,validItem);
	res.send("Item was updated!");
	*/
});	

db.sequelize.sync().then(function(){
	app.listen(PORT,function () {
		console.log("Server listens on Port: " + PORT);
	});

});

//app.use(express.static(__dirname+"/public"));
	