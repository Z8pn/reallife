const {Sequelize,Model,DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('vehicle', {
		id:{
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		model:Sequelize.STRING,
		x:Sequelize.FLOAT,
		y:Sequelize.FLOAT,
		z:Sequelize.FLOAT,
		rx:Sequelize.FLOAT,
		ry:Sequelize.FLOAT,
		rz:Sequelize.FLOAT,
		data:Sequelize.JSON
	});
};
