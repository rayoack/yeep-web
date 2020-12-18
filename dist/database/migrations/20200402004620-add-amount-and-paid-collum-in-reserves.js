"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'amount',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    ),
    queryInterface.addColumn(
      'reserves',
      'paid',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    )
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'amount'
    ),
    queryInterface.removeColumn(
      'reserves',
      'paid'
    )
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  )
};
