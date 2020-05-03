'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'services',
      'user_id',
      {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'services',
      'user_id'
    )
  }
};
