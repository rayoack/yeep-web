'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bank_accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER,
        references: { model: 'accounts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      bank_number: {
        type: Sequelize.STRING
      },
      agency_number: {
        type: Sequelize.STRING
      },
      account_number: {
        type: Sequelize.STRING
      },
      account_complement_number: {
        type: Sequelize.STRING
      },
      account_type: {
        type: Sequelize.STRING
      },
      account_holder_name: {
        type: Sequelize.STRING
      },
      account_holder_document: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('bank_accounts');
  }
};