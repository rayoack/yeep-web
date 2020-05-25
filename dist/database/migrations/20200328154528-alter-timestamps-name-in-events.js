"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.renameColumn('events', 'createdAt', 'created_at'),
    queryInterface.renameColumn('events', 'updatedAt', 'updated_at')
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
