'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('receiver_accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiver_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receiver_access_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receiver_refresh_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      receiver_user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      receiver_token_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('receiver_accounts');
  }
};
