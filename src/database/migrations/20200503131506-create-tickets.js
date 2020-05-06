'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      monetary_unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      sold_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sales_start: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      sales_end: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ticket_availability: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      minimum_purchase: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      maximum_purchase: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      access_ticket: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ticket_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        references: { model: 'events', key: 'id' },
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
    return queryInterface.dropTable('tickets');
  }
};
