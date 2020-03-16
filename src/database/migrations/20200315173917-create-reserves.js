module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('reserves', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    approve: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    start_hour: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    end_hour: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    space_id: {
      type: Sequelize.INTEGER,
      references: { model: 'spaces', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    event_id: {
      type: Sequelize.INTEGER,
      references: { model: 'events', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
    canceled_at: {
      type: Sequelize.DATE,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: queryInterface => queryInterface.dropTable('reserves'),
};
