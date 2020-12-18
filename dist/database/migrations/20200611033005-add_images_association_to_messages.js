"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'messages',
      'image_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'messages',
      'image_id'
    )
  )
};
