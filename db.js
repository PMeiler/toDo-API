var env = process.env.NODE_ENV || "development"
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const _ = require("underscore");
var sequelize;

if (env === "production") {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: "postgres"
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		"dialect": "sqlite",
		"storage": __dirname + "/data/dev-todo-api.sqlite"
	});
}


var db = {};
db.todo = sequelize.import(__dirname + "/models/todo.js");
db.user = sequelize.import(__dirname + "/models/user.js")

db.user.authenticate = function(body) {

	return new Promise(function(resolve, reject) {
		if (typeof body.email != "string" || typeof body.password != "string") {
			reject();
		}
		db.user.findOne({
			where: {
				email: body.email
			}
		}).then(function(user) {
			if (!user || !bcrypt.compareSync(body.password, user.get("password_hash"))) {
				reject();
			} else {
				resolve(user);
			}
		}, function(err) {
			reject();
		})
	})
}

db.user.prototype.toPublicJSON = function() {
	var json = this.toJSON();
	return _.pick(json, "id", "email", "createdAt", "updatedAt");
};


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;