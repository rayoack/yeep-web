"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reserves',
      'status',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reserves',
      'status'
    )
  }
};
