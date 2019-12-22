const {	Sequelize,	Model,	DataTypes} = require('sequelize');
module.exports = function(sequelize) {
	return sequelize.define('vehicle', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		owner:{
			type: Sequelize.INTEGER,
			allowNull: false
		},
		model: Sequelize.STRING,
		x: Sequelize.FLOAT,
		y: Sequelize.FLOAT,
		z: Sequelize.FLOAT,
		rx: Sequelize.FLOAT,
		ry: Sequelize.FLOAT,
		rz: Sequelize.FLOAT,
		data: {
			type: Sequelize.TEXT,
			get: function() {
				return JSON.parse(this.getDataValue('value'));
			},
			set: function(value) {
				this.setDataValue('value', JSON.stringify(value));
			}
		}
	});
};