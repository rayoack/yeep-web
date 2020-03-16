
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'images',
    'event_id',
    {
      type: Sequelize.INTEGER,
      references: { model: 'events', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      allowNull: true,
    },
  ),

  down: queryInterface => queryInterface.removeColumn('images', 'event_id'),
};
