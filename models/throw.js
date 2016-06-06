'use strict';
module.exports = function(sequelize, DataTypes) {
  var Throw = sequelize.define('Throw', {
    round: DataTypes.INTEGER,
    section: DataTypes.STRING,
    number: DataTypes.INTEGER,
    points: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Throw.belongsTo(models.Game);
        Throw.belongsTo(models.Player);
      }
    }
  });
  return Throw;
};