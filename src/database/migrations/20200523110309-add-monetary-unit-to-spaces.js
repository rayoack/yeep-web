'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'spaces',
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
      'spaces',
      'monetary_unit'
    )
  }
};
