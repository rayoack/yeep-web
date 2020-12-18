"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'spaces',
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
      'spaces',
      'register_step'
    )
  }
};
