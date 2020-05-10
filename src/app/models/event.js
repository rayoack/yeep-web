'use strict';
import Sequelize, { Model } from 'sequelize';

class Event extends Model {
  static init(sequelize) {
    super.init({
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      estimated_audience: Sequelize.INTEGER,
      budget: Sequelize.INTEGER,
      target_audience: Sequelize.STRING,
      logo: Sequelize.INTEGER,
      dates: Sequelize.JSON,
      nomenclature: Sequelize.STRING,
      visible: Sequelize.BOOLEAN,
      location_name: Sequelize.STRING,
      adress: Sequelize.STRING,
      state: Sequelize.STRING,
      city: Sequelize.STRING,
      country: Sequelize.STRING,
      online: Sequelize.BOOLEAN,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.belongsTo(models.Image, { foreignKey: 'logo', as: 'event_logo' });
    this.hasMany(models.Image, { foreignKey: 'event_id', as: 'event_images' });
    this.hasMany(models.Reserve, { foreignKey: 'event_id' });
    this.hasMany(models.Ticket, { foreignKey: 'event_id' });
    this.belongsToMany(models.User, {
      through: 'UsersEvents',
      as: 'users',
      foreignKey: 'event_id'
    });
  }
}

export default Event;
