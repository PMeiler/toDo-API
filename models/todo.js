module.exports = function(sequelize,DataType){
		return sequelize.define("todo",{
			description: {
				type: DataType.STRING,
				allowNull: false,
				validate:{
					len: [1,250]
				} 
			},
			done:{
				type: DataType.BOOLEAN,
				defaultValue: false
			}
		})
}