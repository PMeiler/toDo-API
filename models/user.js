module.exports = function(sequelize, DataType) {
	return sequelize.define("user", {
		email: {
			type: DataType.STRING,
			allowNull: false,
			unique: true,
			validate: {
				len: [1, 250],
				isEmail: true
			}
		},
		password: {
			type: DataType.STRING,
			allowNull: false,
			validate: {
				len: [7, 120]
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



	)};