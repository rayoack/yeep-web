'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'reserves',
      'service_id'
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'reserves',
      'service_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'services', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: true,
      },
    )
  )
};
