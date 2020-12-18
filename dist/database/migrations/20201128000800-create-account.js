"use strict";'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      account_type: {
        type: Sequelize.STRING,
      },
      cpf_cnpj: {
        type: Sequelize.STRING,
      },
      date_of_birth: {
        type: Sequelize.STRING,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      post_code: {
        type: Sequelize.STRING,
      },
      adress: {
        type: Sequelize.STRING,
      },
      adress_number: {
        type: Sequelize.STRING,
        defaultValue: 'N/A',
      },
      complement: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      business_area: {
        type: Sequelize.STRING,
      },
      business_url: {
        type: Sequelize.STRING,
      },
      company_type: {
        type: Sequelize.STRING,
      },
      trading_name: {
        type: Sequelize.STRING,
      },
      legal_representative_name: {
        type: Sequelize.STRING,
      },
      legal_representative_document: {
        type: Sequelize.STRING,
      },
      legal_representative_date_of_birth: {
        type: Sequelize.STRING,
      },
      account_status: {
        type: Sequelize.STRING,
      },
      default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    return queryInterface.dropTable('accounts');
  }
};