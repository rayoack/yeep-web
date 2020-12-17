'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.changeColumn(
      'reserves',
      'amount',
      {
        type: Sequelize.DECIMAL(10,2)
      }
    ),
    queryInterface.changeColumn(
      'spaces',
      'price',
      {
        type: Sequelize.DECIMAL(10,2)
      }
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.changeColumn(
      'reserves',
      'amount',
      {
        type: Sequelize.INTEGER
      }
    ),
    queryInterface.changeColumn(
      'spaces',
      'price',
      {
        type: Sequelize.INTEGER
      }
    )
  )
};
