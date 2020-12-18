"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'messages',
      'sender_name',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'messages',
      'sender_avatar',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'messages',
      'sender_name'
    ),
    queryInterface.removeColumn(
      'messages',
      'sender_avatar'
    )
  )
};
