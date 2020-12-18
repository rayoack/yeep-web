"use strict";'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'organizer_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reserves',
      'host_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'reserves',
      'estimated_audience',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'organizer_id'
    ),
    queryInterface.removeColumn(
      'reserves',
      'host_id'
    )
  )
};
