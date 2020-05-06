'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'spaces',
      'has_parking',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    ),
    queryInterface.addColumn(
      'spaces',
      'parking_features',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    ),
    queryInterface.addColumn(
      'spaces',
      'parking_description',
      {
        type: Sequelize.TEXT,
        allowNull: true,
      }
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'spaces',
      'has_parking'
    ),
    queryInterface.removeColumn(
      'spaces',
      'parking_features'
    ),
    queryInterface.removeColumn(
      'spaces',
      'parking_description'
    )
  )
};
