'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('charges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reserve_id: {
        type: Sequelize.INTEGER,
        references: { model: 'reserves', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      juno_charge_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      juno_payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      charge_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      due_date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      billet_link: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      checkout_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      charge_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payments: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable('charges');
  }
};
