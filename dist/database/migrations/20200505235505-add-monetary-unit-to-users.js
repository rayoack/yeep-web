"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'monetary_unit',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'BRL',
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'monetary_unit'
    )
  }
};
