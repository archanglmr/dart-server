'use strict';
module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
    name: DataTypes.STRING,
    version: DataTypes.STRING,
    type: DataTypes.STRING,
    variation: DataTypes.STRING,
    modifiers: DataTypes.STRING,
    gameIdentifier: DataTypes.STRING,
    data: DataTypes.TEXT,
    players: DataTypes.TEXT,
    log: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Game;
};