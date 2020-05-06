'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'events',
      'dates',
     Sequelize.JSON
    ),
    queryInterface.addColumn(
      'events',
      'nomenclature',
     Sequelize.STRING
    ),
    queryInterface.addColumn(
      'events',
      'visible',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'events',
      'dates'
    ),
    queryInterface.removeColumn(
      'events',
      'nomenclature'
    ),
    queryInterface.removeColumn(
      'events',
      'visible'
    )
  )
};
