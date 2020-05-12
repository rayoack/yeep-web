'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'events',
      'register_step',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'events',
      'register_step'
    )
  }
};
