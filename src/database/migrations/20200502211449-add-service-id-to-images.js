'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'images',
    'service_id',
    {
      type: Sequelize.INTEGER,
      references: { model: 'services', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    },
  ),

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('images', 'service_id')
  }
};
