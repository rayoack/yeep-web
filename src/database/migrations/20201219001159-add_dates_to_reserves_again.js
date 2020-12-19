'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reserves',
      'dates',
      Sequelize.JSON
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'reserves',
      'dates'
    )
  }
};
