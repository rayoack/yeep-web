"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'accounts',
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
      'accounts',
      'register_step'
    )
  }
};
