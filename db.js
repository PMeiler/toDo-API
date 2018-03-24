var env = process.env.NODE_ENV || "development"
const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const _ = require("underscore");
const cryptojs = require("crypto-js");
const jwt = require("jsonwebtoken");
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
};

db.user.findUserByToken = function(token) {
	return new Promise(function(resolve, reject) {
		try {
			var tData = jwt.verify(token, "qwert");
			console.log(tData);
			var bytes = cryptojs.AES.decrypt(tData.token, "abcde123!");
			var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
			db.user.findById(tokenData.id).then(function(user) {
				if (user) {
					resolve(user);
				} else {
					reject();
				}
			}, function() {
				reject();
			})
		} catch (e) {
			console.log(e);
			reject();
		}
	})
};

db.user.prototype.toPublicJSON = function() {
	var json = this.toJSON();
	return _.pick(json, "id", "email", "createdAt", "updatedAt");
};
db.user.prototype.generateToken = function(type) {
	if (!_.isString(type)) {
		return undefined;
	}

	try {
		var stringData = JSON.stringify({
			id: this.get("id"),
			type: type
		});
		var encryptedData = cryptojs.AES.encrypt(stringData, "abcde123!").toString();
		var token = jwt.sign({
				token: encryptedData
			},
			"qwert");
		return token;
	} catch (e) {
		console.log(e);
		return undefined;

	}
};



db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;