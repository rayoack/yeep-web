'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reserves',
      'additional_values',
      {
        type: Sequelize.JSON,
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reserves',
      'additional_values'
    )
  }
};
