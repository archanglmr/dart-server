'use strict';
module.exports = function(sequelize, DataTypes) {
  var Dartboard = sequelize.define('Dartboard', {
    name: DataTypes.STRING,
    type: DataTypes.ENUM('hard-tip', 'soft-tip'),
    location: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Dartboard.belongsTo(models.Game, {'as': 'CurrentGame'});
      }
    }
  });
  return Dartboard;
};