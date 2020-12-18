"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'quantity',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    ),
    queryInterface.removeColumn(
      'reserves',
      'dates'
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'quantity'
    ),
    queryInterface.addColumn(
      'reserves',
      'dates',
     Sequelize.JSON
    )
  )
};
