"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'events',
      'location_name',
      {
        type: Sequelize.STRING,
        allowNull: true
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'events',
      'location_name'
    )
  }
};
