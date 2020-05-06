'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'spaces',
      'visible',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    ),
    queryInterface.removeColumn(
      'spaces',
      'services'
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'spaces',
      'visible'
    ),
    queryInterface.addColumn(
      'spaces',
      'services',
     {
        type: Sequelize.JSON,
        allowNull: false,
     }
    )
  )
};
