'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reserves',
      'type',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reserves',
      'type'
    )
  }
};
