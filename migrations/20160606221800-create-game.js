'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      version: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      variation: {
        type: Sequelize.STRING
      },
      modifiers: {
        type: Sequelize.STRING
      },
      gameIdentifier: {
        type: Sequelize.STRING
      },
      data: {
        type: Sequelize.TEXT
      },
      players: {
        type: Sequelize.TEXT
      },
      log: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Games');
  }
};