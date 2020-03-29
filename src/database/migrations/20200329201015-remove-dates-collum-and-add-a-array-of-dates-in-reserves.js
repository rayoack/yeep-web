'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'start_date'
    ),
    queryInterface.removeColumn(
      'reserves',
      'end_date'
    ),
    queryInterface.removeColumn(
      'reserves',
      'start_hour'
    ),
    queryInterface.removeColumn(
      'reserves',
      'end_hour'
    ),
    queryInterface.addColumn(
      'reserves',
      'dates',
     Sequelize.JSON
    )
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  ),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
