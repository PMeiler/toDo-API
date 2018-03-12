const Sequelize = require("sequelize");
const sequelize = new Sequelize(undefined, undefined, undefined, {
	"dialect": "sqlite",
	"storage": "basic-sqlite-database.sqlite"
});


const Todo = sequelize.define("todo", {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	done: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});



sequelize.sync().then(function() {
	console.log("Everything is synced");



	Todo.update(
		description: "Walk the cat"
	}, {
		where: {
			id: 1
		}
	}).then(function() {
	Todo.findById(1).then(function(todo) {
		console.log(todo.toJSON());
	})
}, function(err) {
	console.log(err);
});

/*
	Todo.destroy({
		where: {
			id: 6
		}
	}).then(function(todo){
		console.log("success!");
	},function(err){
		console.log(err);
	});


*/
/*
	Todo.create({
		description: "I'm good!",
		done: true
	}).then(function(todo){
		console.log("Finished!");
		console.log(todo.toJSON());
	}).catch(function(e){
		console.log(e);
	});
*/

/*	Todo.findById(20).then(function(todo){
		if(todo){
			console.log("Item found:");
			return console.log(todo.toJSON());
		} else {
			console.log("Item is not in the Database!");
		}
	}).catch(function(error){
		return console.log(error);
	});	
*/



/*
	Todo.create({
		description:"Walk the dog!",
	}).then(function(todo){
		return Todo.create({
			description:"Water the plants!",
		});
	}).then(function(){
		return Todo.findAll({
			where:{
				done: false
			}
		})
	}).then(function(todos){
		console.log("Printing Array:");
		return todos.forEach(function(todo){
			console.log(todo.toJSON());
		});
	}).catch(function(error){
		console.log	(error);
	});


*/

});