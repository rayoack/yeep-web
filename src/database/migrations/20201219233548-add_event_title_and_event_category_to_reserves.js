'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'event_title',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'reserves',
      'event_category',
      Sequelize.STRING
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'event_title'
    ),
    queryInterface.removeColumn(
      'reserves',
      'event_category'
    )
  )
};
