"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'images',
    'space_id',
    {
      type: Sequelize.INTEGER,
      references: { model: 'spaces', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('images', 'space_id'),
};
