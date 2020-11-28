'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn(
      'users',
      'cpf_cnpj',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'users',
      'date_of_birth',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'users',
      'phone_number',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'users',
      'post_code',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    ),
    queryInterface.addColumn(
      'users',
      'adress_number',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    )
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn(
      'users',
      'cpf_cnpj'
    ),
    queryInterface.removeColumn(
      'users',
      'date_of_birth'
    ),
    queryInterface.removeColumn(
      'users',
      'phone_number'
    ),
    queryInterface.removeColumn(
      'users',
      'city'
    ),
    queryInterface.removeColumn(
      'users',
      'post_code'
    ),
    queryInterface.removeColumn(
      'users',
      'adress_number'
    )
  )
};
