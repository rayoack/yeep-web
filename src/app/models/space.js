'use strict';
import Sequelize, { Model } from 'sequelize';

class Space extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      adress: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      country: Sequelize.STRING,
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      price: Sequelize.INTEGER,
      charge_type: Sequelize.INTEGER,
      capacity: Sequelize.INTEGER,
      features: Sequelize.STRING,
      restrictions: Sequelize.STRING,
      services: Sequelize.JSON,
      open_hour: Sequelize.STRING,
      close_hour: Sequelize.STRING,
      owner_id: Sequelize.INTEGER,
    }, {
      sequelize,
    });
    return this;
  }

  static associate(models) {
    // associations can be defined here
    this.hasMany(models.Service, { foreignKey: 'space_id' });
    this.belongsTo(models.User, { foreignKey: 'owner_id' });
    this.hasMany(models.Reserve, { foreignKey: 'space_id' });
    this.hasMany(models.Image, { foreignKey: 'space_id' });
  };
};

export default Space;
