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
app.get("/todo", function(req, res) {
	var qry = req.query;
	var where = {};

	if (qry.hasOwnProperty("done") && qry.done === "true") {
		where.done = true;
	} else if (qry.hasOwnProperty("done") && qry.done === "false") {
		where.done = false;
	}


	if (qry.hasOwnProperty("q")) {
		where.description = {
			$like: "%" + qry.q + "%"
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.send(todos);
	}, function(err) {
		res.status(500).send();
	});


});

//Ausgabe eines bestimmten ToDo Elementes
app.get("/todo/:id", function(req, res) {
	var gId = parseInt(req.params.id, 10);
	//	var found = _.findWhere(todos,{id:gId});

	db.todo.findById(gId).then(function(todo) {
		if (!!todo) {
			res.json(todo);
		} else {
			res.status(404).send();
		}
	}, function(err) {
		res.status(500).json(err);
	});

});

//Füge ein neues Element der ToDo Liste bei!
app.post("/todo/add", function(req, res) {
	var body = req.body;

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(error) {
		res.status(400).json(error);
	});

});

//Lösche ein Element der ToDo Liste
app.delete("/todo/:id", function(req, res) {

	var gId = parseInt(req.params.id, 10);
	//var found = _.findWhere(todos,{id:gId});

	db.todo.destroy({
		where: {
			id: gId
		}
	}).then(function(todo) {
		if (todo === 0) {
			res.status(404).json({
				error: "No Todo Item here!"
			})
		} else {
			res.status(204).send();
		}
	}, function(err) {
		res.status(500).send();
	})

});

//Updating
app.put("/todo/:id", function(req, res) {
	var gId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, "description", "done");
	var attributes = {};

	db.todo.update(body, {
		where: {
			id: gId
		}
	}).then(function(todo) {
		console.log(todo);
		if (todo[0] == 0) {
			res.status(404).json({
				error: "Item was not found!"
			})
		} else {
			res.status(200).send()
		}
	}, function(err) {
		res.status(500).send();
	})

});


//Registration
app.post("/user", function(req, res) {
	var body = _.pick(req.body, "email", "password");

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());
		//res.send("User:" + body.email + " successfully created!")
	}, function(error) {
		res.status(400).json(error)
	});
});


//UserName Login
app.post("/user/login", function(req, res) {
	var body = _.pick(req.body, "email", "password")

	db.user.authenticate(body).then(function(user) {
		res.json(user.toPublicJSON());
	}, function(err) {
		res.status(401).send();
	});

})


db.sequelize.sync({force:true}).then(function() {
	app.listen(PORT, function() {
		console.log("Server listens on Port: " + PORT);
	});

});