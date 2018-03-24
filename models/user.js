const bcrypt = require("bcrypt");
const _ = require("underscore");

module.exports = function(sequelize, DataType) {
	return sequelize.define("user", {
			email: {
				type: DataType.STRING,
				unique: true,
				validate: {
					len: [1, 250],
					isEmail: true
				}
			},
			salt: {
				type: DataType.STRING
			},
			password_hash: {
				type: DataType.STRING
			},
			password: {
				type: DataType.VIRTUAL,
				allowNull: false,
				validate: {
					len: [7, 120]
				},
				set: function(value) {
					var salt = bcrypt.genSaltSync(10);
					var passwordHash = bcrypt.hashSync(value, salt);

					this.setDataValue("password", value);
					this.setDataValue("salt", salt);
					this.setDataValue("password_hash", passwordHash);
				}
			}

		},

		{
			hooks: {
				beforeValidate: function(user, options) {
					if (typeof user.email === "string" && user.email.length > 0) {
						user.email = user.email.toLowerCase();
					}
				}
			}
		}



	)
};