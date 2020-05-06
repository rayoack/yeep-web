'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'events',
      'adress',
     Sequelize.STRING
    ),
    queryInterface.addColumn(
      'events',
      'city',
     Sequelize.STRING
    ),
    queryInterface.addColumn(
      'events',
      'state',
     Sequelize.STRING
    ),
    queryInterface.addColumn(
      'events',
      'country',
     Sequelize.STRING
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'events',
      'adress'
    ),
    queryInterface.removeColumn(
      'events',
      'city'
    ),
    queryInterface.removeColumn(
      'events',
      'state'
    ),
    queryInterface.removeColumn(
      'events',
      'country'
    )
  )
};
