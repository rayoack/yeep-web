'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reserves',
      'service_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'services', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reserves',
      'service_id'
    )
  }
};
