'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'last_message_target_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reserves',
      'last_message_target_read',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'last_message_target_id'
    ),
    queryInterface.removeColumn(
      'reserves',
      'last_message_target_read'
    )
  )
};
