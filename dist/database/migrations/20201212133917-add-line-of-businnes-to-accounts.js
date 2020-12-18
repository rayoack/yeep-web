"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'accounts',
      'line_of_business',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'accounts',
      'line_of_business'
    )
  }
};
