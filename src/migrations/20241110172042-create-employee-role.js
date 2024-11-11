// 20241110172042-create-employee-role.js
'use strict';

const { Unique, IsNull } = require("sequelize-typescript");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('employee_roles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        unique: true, 
        allowNull: false
      },
      isDeleted: {
        type: Sequelize.SMALLINT,
        defaultValue: null,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('employee_roles');
  }
};
