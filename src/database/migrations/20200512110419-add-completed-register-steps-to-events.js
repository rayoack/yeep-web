'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'events',
      'completed_register_steps',
      {
        type: Sequelize.JSON,
        allowNull: true
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'events',
      'completed_register_steps'
    )
  }
};
