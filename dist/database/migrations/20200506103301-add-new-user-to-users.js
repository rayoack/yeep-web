"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'new_user',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'new_user'
    )
  }
};
