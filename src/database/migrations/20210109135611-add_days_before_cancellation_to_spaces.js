'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'spaces',
      'days_before_cancellation',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'spaces',
      'days_before_cancellation'
    )
  }
};
