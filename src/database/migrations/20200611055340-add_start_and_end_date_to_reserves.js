'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'start_date',
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reserves',
      'end_date',
      {
        type: Sequelize.DATE,
        allowNull: true,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'start_date'
    ),
    queryInterface.removeColumn(
      'reserves',
      'end_date'
    )
  )
};
