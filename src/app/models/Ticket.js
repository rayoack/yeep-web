'use strict';
import Sequelize, { Model } from 'sequelize';

class Ticket extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      monetary_unit: Sequelize.STRING,
      quantity: Sequelize.INTEGER,
      price: Sequelize.DECIMAL,
      sold_by: Sequelize.STRING,
      sales_start: Sequelize.DATE,
      sales_end: Sequelize.DATE,
      ticket_availability: Sequelize.STRING,
      minimum_purchase: Sequelize.INTEGER,
      maximum_purchase: Sequelize.INTEGER,
      access_ticket: Sequelize.STRING,
      ticket_description: Sequelize.TEXT,
      visible: Sequelize.BOOLEAN,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.Event, { foreignKey: 'event_id' });
  }
}

export default Ticket;
